import React, { useState } from 'react';
import { appState } from '../services/appStateService';
import { RewardRecord } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { OFFICIAL_REWARD_CATALOG } from '../domain/rewards/rewardCatalog';
import { Award, Heart, Plus, Check, X, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RewardsPage: React.FC = () => {
  const rewards = appState.rewards;
  const positiveNotes = appState.positiveNotes;
  const students = appState.students;
  const currentUser = appState.currentUser;

  const [activeTab, setActiveTab] = useState<'rewards' | 'positive_notes'>('rewards');

  // New reward form state
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [rewardCode, setRewardCode] = useState<'RW01' | 'RW02' | 'RW03' | 'RW04'>('RW01');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [evidenceUrl, setEvidenceUrl] = useState('');

  // New positive note form state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteStudentId, setNoteStudentId] = useState(students[0]?.id || '');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<'academic' | 'discipline' | 'helping_others' | 'sports_arts' | 'general'>('helping_others');

  const canManageRewards =
    currentUser.role === 'gvcn' ||
    currentUser.role === 'lop_truong' ||
    currentUser.role === 'lop_pho';

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogItem = OFFICIAL_REWARD_CATALOG.find((c) => c.code === rewardCode);
    const points = catalogItem?.points ?? 1;

    const result = appState.submitReward({
      student_id: studentId,
      class_id: 'class-10a16',
      reward_code: rewardCode,
      title: title.trim(),
      points,
      status: canManageRewards ? 'approved' : 'pending',
      proposer: currentUser.name,
      approver: canManageRewards ? currentUser.name : undefined,
      evidence_url: evidenceUrl || undefined,
      date,
    });

    if (result.warning) {
      appState.showToast(result.warning, 'warn');
    } else {
      appState.showToast(`Đã đề xuất khen thưởng cho học sinh (${canManageRewards ? 'Đã duyệt' : 'Chờ Ban cán sự duyệt'})!`, 'success');
    }

    setShowRewardModal(false);
    setTitle('');
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    appState.addPositiveNote({
      student_id: noteStudentId,
      class_id: 'class-10a16',
      teacher_name: currentUser.name,
      note_content: noteContent.trim(),
      date: new Date().toISOString().split('T')[0],
      category: noteCategory,
    });

    appState.showToast('Đã gửi lời khen ghi nhận tích cực đến học sinh!', 'success');
    setShowNoteModal(false);
    setNoteContent('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Khen thưởng & Ghi nhận Tích cực
          </h2>
          <p className="text-xs text-slate-500">
            Biểu dương thành tích chính quy theo QĐ 525 (RW01–RW04) và Lời khen động viên phi điểm số
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canManageRewards ? (
            <>
              <button
                onClick={() => setShowRewardModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                Đề xuất khen thưởng
              </button>
              <button
                onClick={() => setShowNoteModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4" />
                Gửi lời khen
              </button>
            </>
          ) : (
            <div className="px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Chế độ Chỉ xem (Không có quyền đề xuất)</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'rewards'
              ? 'bg-emerald-100 text-emerald-950 font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Điểm thưởng chính thức (RW01–RW04)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-200 text-emerald-900">
            {rewards.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('positive_notes')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'positive_notes'
              ? 'bg-pink-100 text-pink-950 font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4 text-pink-600" />
          <span>Lời khen tích cực (Phi điểm số)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-pink-200 text-pink-900">
            {positiveNotes.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Rewards list */}
      {activeTab === 'rewards' && (
        <div className="space-y-3">
          {/* Mobile Card Feed */}
          <div className="md:hidden space-y-2.5">
            {rewards.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                Chưa có ghi nhận khen thưởng nào.
              </div>
            ) : (
              rewards.map((r) => {
                const student = students.find((s) => s.id === r.student_id);
                return (
                  <div key={r.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{student?.full_name || 'N/A'}</span>
                        <span className="font-mono text-[11px] text-blue-700 font-semibold ml-1.5">
                          ({student?.student_code || r.student_id})
                        </span>
                      </div>
                      <span className="font-black font-mono text-emerald-600 text-xs">+{r.points}đ</span>
                    </div>

                    <div className="text-xs">
                      <div className="font-bold text-slate-800">{r.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Mã: {r.reward_code} · {r.date} · Đề xuất: {r.proposer}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <StatusBadge type={r.status === 'approved' ? 'Đã duyệt' : 'Chờ xác minh'} />
                      {canManageRewards && r.status === 'pending' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              appState.reviewReward(r.id, true);
                              appState.showToast(`Đã duyệt khen thưởng cho ${student?.full_name}!`, 'success');
                            }}
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg transition"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => {
                              appState.reviewReward(r.id, false);
                              appState.showToast(`Đã từ chối khen thưởng.`, 'info');
                            }}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold rounded-lg transition"
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ngày</th>
                  <th className="py-3 px-4">Mã số</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Mã thưởng & Danh mục</th>
                  <th className="py-3 px-4">Điểm cộng</th>
                  <th className="py-3 px-4">Người đề xuất</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  {canManageRewards && <th className="py-3 px-4 text-right">Phê duyệt</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rewards.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      Chưa có ghi nhận khen thưởng nào.
                    </td>
                  </tr>
                ) : (
                  rewards.map((r) => {
                    const student = students.find((s) => s.id === r.student_id);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono text-slate-600">{r.date}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">
                          {student?.student_code || r.student_id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{student?.full_name || 'N/A'}</div>
                          {r.duplicate_warning && (
                            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1 rounded border border-amber-200">
                              Cảnh báo trùng ngày
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{r.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Danh mục: {r.reward_code}</div>
                        </td>
                        <td className="py-3 px-4 font-black font-mono text-emerald-600">+{r.points}đ</td>
                        <td className="py-3 px-4 text-slate-600">{r.proposer}</td>
                        <td className="py-3 px-4">
                          <StatusBadge type={r.status === 'approved' ? 'Đã duyệt' : 'Chờ xác minh'} />
                        </td>
                        {canManageRewards && (
                          <td className="py-3 px-4 text-right">
                            {r.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => appState.reviewReward(r.id, true)}
                                  className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg"
                                  title="Duyệt cộng điểm"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => appState.reviewReward(r.id, false)}
                                  className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg"
                                  title="Từ chối"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400">Đã chốt</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Tab 2: Positive Notes */}
      {activeTab === 'positive_notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {positiveNotes.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
              Chưa có lời khen ghi nhận. Hãy gửi lời khen để động viên tinh thần tự giác của học sinh!
            </div>
          ) : (
            positiveNotes.map((note) => {
              const student = students.find((s) => s.id === note.student_id);
              return (
                <div key={note.id} className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
                        {student?.first_name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{student?.full_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{student?.student_code}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{note.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 italic bg-pink-50/50 p-3 rounded-xl border border-pink-100">
                    &ldquo;{note.note_content}&rdquo;
                  </p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Người khen: {note.teacher_name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold uppercase text-[9px]">
                      {note.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Reward Propose Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Đề xuất Khen thưởng (QĐ 525)</h3>
              <button onClick={() => setShowRewardModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateReward} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Học sinh được khen</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
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
                <label className="block font-semibold text-slate-700 mb-1">Danh mục thưởng QĐ 525</label>
                <select
                  value={rewardCode}
                  onChange={(e) => setRewardCode(e.target.value as any)}
                  className="w-full p-2 border rounded-lg border-slate-300 font-semibold"
                >
                  {OFFICIAL_REWARD_CATALOG.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code}: {item.title} (+{item.points}đ/{item.periodUnit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chi tiết thành tích / Giấy khen</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Đạt giải Ba Hội thi Em yêu Lịch sử cấp trường..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ngày lập thành tích</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border rounded-lg border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRewardModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                >
                  Gửi đề xuất
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Positive Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Gửi Lời khen Tích cực (Phi điểm)</h3>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Học sinh</label>
                <select
                  value={noteStudentId}
                  onChange={(e) => setNoteStudentId(e.target.value)}
                  className="w-full p-2 border rounded-lg border-slate-300"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.student_code} - {s.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung lời khen động viên</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi nhận hành động đẹp, sự tiến bộ, tinh thần tương trợ..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-2 border rounded-lg border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-pink-600 text-white rounded-lg hover:bg-pink-500"
                >
                  Lưu lời khen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
