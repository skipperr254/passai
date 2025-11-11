import { Upload, FileText, Image, File, CheckCircle2 } from "lucide-react";

export default function UploadPage() {
  const recentUploads = [
    {
      id: 1,
      name: "Calculus_Notes.pdf",
      subject: "Mathematics",
      size: "2.4 MB",
      date: "Nov 13, 2025",
      status: "processed",
    },
    {
      id: 2,
      name: "Physics_Lab_Report.docx",
      subject: "Physics",
      size: "1.8 MB",
      date: "Nov 12, 2025",
      status: "processed",
    },
    {
      id: 3,
      name: "Chemistry_Diagram.png",
      subject: "Chemistry",
      size: "856 KB",
      date: "Nov 11, 2025",
      status: "processed",
    },
  ];

  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".pdf")) return FileText;
    if (filename.endsWith(".png") || filename.endsWith(".jpg")) return Image;
    return File;
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Upload Materials
          </h1>
          <p className="text-slate-600">
            Upload your study materials and let AI help you learn
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Drop your files here
            </h3>
            <p className="text-slate-600 mb-6">
              or click to browse from your computer
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-500/25">
              Choose Files
            </button>
            <p className="text-sm text-slate-500 mt-4">
              Supports PDF, DOCX, TXT, PNG, JPG (Max 10MB)
            </p>
          </div>
        </div>

        {/* Upload Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">
                Total Uploads
              </p>
            </div>
            <p className="text-3xl font-bold text-slate-900">124</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Documents</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">98</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Image className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Images</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">26</p>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Recent Uploads
          </h2>
          <div className="space-y-3">
            {recentUploads.map((upload) => {
              const FileIcon = getFileIcon(upload.name);
              return (
                <div
                  key={upload.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <FileIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {upload.name}
                    </p>
                    <p className="text-sm text-slate-600">{upload.subject}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-slate-900">
                      {upload.size}
                    </p>
                    <p className="text-xs text-slate-500">{upload.date}</p>
                  </div>
                  <div className="shrink-0">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      {upload.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
