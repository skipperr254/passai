import { supabase } from "@/lib/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types";
import type { MaterialCoverage } from "../types/analytics.types";

type CoverageInsert = TablesInsert<"material_coverage">;
type CoverageUpdate = TablesUpdate<"material_coverage">;

// Response type
type CoverageServiceResponse<T> = {
  data: T | null;
  error: string | null;
};

/**
 * Error handler for database operations
 */
function handleDatabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unexpected error occurred";
}

/**
 * Get material coverage for a subject (for the current user)
 */
export async function getMaterialCoverage(
  subjectId: string
): Promise<CoverageServiceResponse<MaterialCoverage[]>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to view material coverage",
      };
    }

    // Fetch coverage records with material details
    const { data, error } = await supabase
      .from("material_coverage")
      .select(
        `
        *,
        study_materials!inner(
          id,
          title,
          file_type
        )
      `
      )
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .order("last_accessed_at", { ascending: false, nullsFirst: false });

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    // Map to MaterialCoverage type with nested material info
    const coverage = data.map((item) => {
      const material = Array.isArray(item.study_materials)
        ? item.study_materials[0]
        : item.study_materials;

      return {
        ...item,
        material_name: material?.title ?? "Unknown Material",
        material_type: material?.file_type ?? "unknown",
      } as MaterialCoverage;
    });

    return {
      data: coverage,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Update or create material coverage record
 */
export async function updateMaterialCoverage(
  subjectId: string,
  materialId: string,
  coverageData: {
    coveragePercentage: number;
    timeSpentMinutes: number;
    notes?: string | null;
  }
): Promise<CoverageServiceResponse<MaterialCoverage>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to update material coverage",
      };
    }

    // Verify material exists and belongs to the subject
    const { data: material, error: materialError } = await supabase
      .from("study_materials")
      .select("id, subject_id")
      .eq("id", materialId)
      .single();

    if (materialError || !material) {
      return {
        data: null,
        error: "Material not found",
      };
    }

    if (material.subject_id !== subjectId) {
      return {
        data: null,
        error: "Material does not belong to the specified subject",
      };
    }

    // Check if a coverage record already exists
    const { data: existing, error: fetchError } = await supabase
      .from("material_coverage")
      .select("id")
      .eq("user_id", user.id)
      .eq("material_id", materialId)
      .maybeSingle();

    if (fetchError) {
      return {
        data: null,
        error: handleDatabaseError(fetchError),
      };
    }

    if (existing) {
      // Update existing record
      const updateData: CoverageUpdate = {
        coverage_percentage: Math.min(
          100,
          Math.max(0, Math.round(coverageData.coveragePercentage))
        ),
        time_spent_minutes: coverageData.timeSpentMinutes,
        last_accessed_at: new Date().toISOString(),
      };

      if (coverageData.notes !== undefined) {
        updateData.notes = coverageData.notes;
      }

      const { data, error } = await supabase
        .from("material_coverage")
        .update(updateData)
        .eq("id", existing.id)
        .select(
          `
          *,
          study_materials!inner(
            id,
            title,
            file_type
          )
        `
        )
        .single();

      if (error) {
        return {
          data: null,
          error: handleDatabaseError(error),
        };
      }

      const mat = Array.isArray(data.study_materials)
        ? data.study_materials[0]
        : data.study_materials;

      return {
        data: {
          ...data,
          material_name: mat?.title ?? "Unknown Material",
          material_type: mat?.file_type ?? "unknown",
        } as MaterialCoverage,
        error: null,
      };
    } else {
      // Create new record
      const insertData: CoverageInsert = {
        user_id: user.id,
        subject_id: subjectId,
        material_id: materialId,
        coverage_percentage: Math.min(
          100,
          Math.max(0, Math.round(coverageData.coveragePercentage))
        ),
        time_spent_minutes: coverageData.timeSpentMinutes,
        last_accessed_at: new Date().toISOString(),
        notes: coverageData.notes ?? null,
      };

      const { data, error } = await supabase
        .from("material_coverage")
        .insert(insertData)
        .select(
          `
          *,
          study_materials!inner(
            id,
            title,
            file_type
          )
        `
        )
        .single();

      if (error) {
        return {
          data: null,
          error: handleDatabaseError(error),
        };
      }

      const mat = Array.isArray(data.study_materials)
        ? data.study_materials[0]
        : data.study_materials;

      return {
        data: {
          ...data,
          material_name: mat?.title ?? "Unknown Material",
          material_type: mat?.file_type ?? "unknown",
        } as MaterialCoverage,
        error: null,
      };
    }
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Calculate overall coverage percentage for a subject
 */
export async function calculateOverallCoverage(
  subjectId: string
): Promise<
  CoverageServiceResponse<{
    overallCoverage: number;
    totalMaterials: number;
    coveredMaterials: number;
  }>
> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to calculate coverage",
      };
    }

    // Get all materials for the subject
    const { data: materials, error: materialsError } = await supabase
      .from("study_materials")
      .select("id")
      .eq("subject_id", subjectId);

    if (materialsError) {
      return {
        data: null,
        error: handleDatabaseError(materialsError),
      };
    }

    const totalMaterials = materials?.length ?? 0;

    if (totalMaterials === 0) {
      return {
        data: {
          overallCoverage: 0,
          totalMaterials: 0,
          coveredMaterials: 0,
        },
        error: null,
      };
    }

    // Get coverage records for this user and subject
    const { data: coverageRecords, error: coverageError } = await supabase
      .from("material_coverage")
      .select("coverage_percentage")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId);

    if (coverageError) {
      return {
        data: null,
        error: handleDatabaseError(coverageError),
      };
    }

    const coveredCount =
      coverageRecords?.filter((r) => r.coverage_percentage >= 100).length ?? 0;

    // Calculate average coverage across all materials
    const totalCoverage =
      coverageRecords?.reduce(
        (sum, record) => sum + record.coverage_percentage,
        0
      ) ?? 0;
    const avgCoverage =
      coverageRecords && coverageRecords.length > 0
        ? Math.round(totalCoverage / totalMaterials)
        : 0;

    return {
      data: {
        overallCoverage: avgCoverage,
        totalMaterials,
        coveredMaterials: coveredCount,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}
