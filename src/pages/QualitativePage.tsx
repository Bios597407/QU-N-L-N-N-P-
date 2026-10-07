import React, { useState } from 'react';
import { appState } from '../services/appStateService';
import { MessageSquare, Heart, ShieldAlert, Plus, User, CheckCircle2 } from 'lucide-react';

export const QualitativePage: React.FC = () => {
  const students = appState.students;
  const currentUser = appState.currentUser;

  const [activeTab, setActiveTab] = useState<'self' | 'group' | 'teacher' | 'parent' | 'support'>('teacher');

  // Teacher comment state
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [teacherCommentText, setTeacherCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<{ studentId: string; author: string; content: string; date: string }[]>([
    {
      studentId: students[0]?.id || '',
      author: 'Thầy Trần Duy Tân (GVCN)',
      content: 'Học sinh có ý thức kỷ luật tốt, năng nổ tham gia các phong trào chung của chi đoàn.',
      date: '2026-10-05',
    },
  ]);

  // Support plan state
  const [supportPlans, setSupportPlans] = useState<{ studentId: string; objective: string; plan: string; status: string }[]>([
    {
      studentId: students[1]?.id || '',
      objective: 'Cải thiện nề nếp đi học đúng giờ trước 06:45',
      plan: 'Phối hợp phụ huynh nhắc nhở, xếp ngồi cạnh lớp trưởng để hỗ trợ đôn đốc',
      status: 'Đang thực hiện',
    },
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherCommentText.trim()) return;

    setCommentsList((prev) => [
      {
        studentId: selectedStudentId,
        author: currentUser.name,
        content: teacherCommentText.trim(),
        date: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ]);

    appState.addAuditLog(currentUser.name, 'Ghi nhận nhận xét sư phạm', 'comment', selectedStudentId);
    setTeacherCommentText('');
    appState.showToast('Đã lưu nhận xét của giáo viên thành công!', 'success');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Đánh giá Định tính & Kế hoạch Hỗ trợ
          </h2>
          <p className="text-xs text-slate-500">
            Kết hợp tự đánh giá, nhận xét tổ, tiếng nói phụ huynh và kế hoạch đồng hành sư phạm
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'teacher', label: 'Nhận xét của Giáo viên' },
          { id: 'self', label: 'Học sinh Tự đánh giá' },
          { id: 'group', label: 'Đánh giá của Tổ' },
          { id: 'parent', label: 'Phản hồi Phụ huynh' },
          { id: 'support', label: 'Kế hoạch Hỗ trợ (5+ HS)' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
              activeTab === t.id
                ? 'bg-blue-600 text-white font-black shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Teacher Comments Tab */}
      {activeTab === 'teacher' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Ghi nhận xét giáo viên</h3>
            <form onSubmit={handleAddComment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn học sinh</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2 border rounded-lg border-slate-300 font-semibold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.student_code} - {s.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung nhận xét</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhận xét về thái độ, sự tiến bộ, tinh thần rèn luyện..."
                  value={teacherCommentText}
                  onChange={(e) => setTeacherCommentText(e.target.value)}
                  className="w-full p-2.5 border rounded-lg border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition active:scale-95"
              >
                Lưu nhận xét
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-sm text-slate-800">Danh sách nhận xét đã ghi ({commentsList.length})</h3>
            <div className="space-y-2">
              {commentsList.map((c, i) => {
                const stu = students.find((s) => s.id === c.studentId);
                return (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900">
                        {stu?.full_name} ({stu?.student_code})
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{c.date}</span>
                    </div>
                    <p className="text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                      &ldquo;{c.content}&rdquo;
                    </p>
                    <div className="text-[10px] text-slate-500 text-right">Người nhận xét: {c.author}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Support Plans Tab */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Kế hoạch Hỗ trợ Học sinh cần Cải thiện</h3>
              <p className="text-xs text-slate-500">
                Chương trình đồng hành sư phạm giúp học sinh khắc phục khuyết điểm nề nếp
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportPlans.map((sp, idx) => {
              const stu = students.find((s) => s.id === sp.studentId);
              return (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 text-sm">
                      {stu?.full_name} ({stu?.student_code})
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {sp.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Mục tiêu: </span>
                    <span className="text-slate-900">{sp.objective}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Biện pháp: </span>
                    <span className="text-slate-600">{sp.plan}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fallback for other qualitative tabs */}
      {(activeTab === 'self' || activeTab === 'group' || activeTab === 'parent') && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">
            Phân hệ {activeTab === 'self' ? 'Tự đánh giá học sinh' : activeTab === 'group' ? 'Đánh giá của tổ' : 'Phản hồi cha mẹ học sinh'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Học sinh và phụ huynh có thể gửi phản hồi trực tiếp khi đăng nhập vào hệ thống với vai trò tương ứng. Dữ liệu được bảo mật theo chính sách quyền riêng tư của lớp học.
          </p>
        </div>
      )}
    </div>
  );
};
