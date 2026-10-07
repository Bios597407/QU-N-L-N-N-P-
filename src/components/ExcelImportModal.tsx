import React, { useState } from 'react';
import { ExcelService, ImportValidationResult } from '../services/excelService';
import { appState } from '../services/appStateService';
import { Student } from '../types';
import { X, Upload, FileCheck, AlertTriangle, Check, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelImportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [committedCount, setCommittedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = await ExcelService.parseStudentRosterFile(selectedFile);
      setValidationResult(result);
    } catch (err: any) {
      setErrorMsg(`Lỗi đọc tệp Excel: ${err.message || 'Định dạng tệp không tương thích'}`);
      setValidationResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommitImport = () => {
    if (!validationResult || validationResult.validRows.length === 0) return;

    // Convert valid rows into Student objects
    const newStudents: Student[] = validationResult.validRows.map((row, idx) => ({
      id: `stu-${row.student_code.replace(/[^a-zA-Z0-9]/g, '_')}`,
      student_code: row.student_code,
      last_name: row.last_name,
      first_name: row.first_name,
      full_name: row.full_name,
      class_id: 'class-10a16',
      is_demo: false,
      status: 'active',
    }));

    // Explicit transactional commit
    appState.students = newStudents;
    appState.calculateAllWeeklyScores(1);
    appState.addAuditLog(
      appState.currentUser.name,
      'Nhập danh sách học sinh từ Excel',
      'students',
      'class-10a16',
      `Tệp: ${file?.name}, Số lượng: ${newStudents.length} học sinh. Fingerprint: ${validationResult.fingerprint}`
    );

    setCommittedCount(newStudents.length);
    setTimeout(() => {
      onClose();
      setCommittedCount(null);
      setFile(null);
      setValidationResult(null);
    }, 1800);
  };

  const handleReset = () => {
    setFile(null);
    setValidationResult(null);
    setCommittedCount(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">Nhập danh sách học sinh từ Excel</h3>
              <p className="text-xs text-slate-300">Hỗ trợ tệp định dạng .xlsx, .xls</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {committedCount !== null ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-800">Nhập dữ liệu thành công!</h4>
              <p className="text-xs text-slate-600">
                Đã cập nhật {committedCount} học sinh vào lớp 10A16 và ghi nhận nhật ký kiểm toán.
              </p>
            </div>
          ) : (
            <>
              {/* File upload drag drop area */}
              {!validationResult && (
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center bg-slate-50 transition cursor-pointer">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-file-input"
                  />
                  <label htmlFor="excel-file-input" className="cursor-pointer block space-y-2">
                    <FileCheck className="w-10 h-10 text-slate-400 mx-auto" />
                    <div className="text-xs font-semibold text-slate-700">
                      Nhấn để chọn tệp Excel hoặc kéo thả vào đây
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Cột yêu cầu: STT, Mã số (hoặc Mã HS), Họ và tên (hoặc Họ và / Tên)
                    </div>
                  </label>
                </div>
              )}

              {isProcessing && (
                <div className="flex items-center justify-center gap-2 py-4 text-xs font-semibold text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Đang phân tích cấu trúc tệp Excel...
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Validation Result Preview */}
              {validationResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{file?.name}</span>
                      <span className="text-slate-500 ml-2">
                        ({(file?.size ? file.size / 1024 : 0).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Chọn tệp khác
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[11px]">Tổng số dòng</div>
                      <div className="font-bold text-base text-slate-800">{validationResult.totalRows}</div>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="text-emerald-700 text-[11px]">Hợp lệ sẵn sàng</div>
                      <div className="font-bold text-base text-emerald-800">
                        {validationResult.validRows.length}
                      </div>
                    </div>
                    <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200">
                      <div className="text-rose-700 text-[11px]">Lỗi dữ liệu</div>
                      <div className="font-bold text-base text-rose-800">{validationResult.errors.length}</div>
                    </div>
                  </div>

                  {validationResult.errors.length > 0 && (
                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs space-y-1 max-h-28 overflow-y-auto">
                      <div className="font-bold text-rose-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Danh sách lỗi phát hiện:
                      </div>
                      {validationResult.errors.map((err, idx) => (
                        <div key={idx} className="text-rose-700 text-[11px]">
                          Dòng {err.row}: [{err.column}] {err.message}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Preview table */}
                  <div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">
                      Xem trước dữ liệu ({Math.min(validationResult.validRows.length, 5)} /{' '}
                      {validationResult.validRows.length} học sinh)
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden text-xs max-h-48 overflow-y-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                          <tr>
                            <th className="py-1.5 px-3">STT</th>
                            <th className="py-1.5 px-3">Mã số</th>
                            <th className="py-1.5 px-3">Họ và tên</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {validationResult.validRows.slice(0, 5).map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="py-1.5 px-3">{row.stt}</td>
                              <td className="py-1.5 px-3 font-mono font-medium">{row.student_code}</td>
                              <td className="py-1.5 px-3 font-semibold text-slate-800">{row.full_name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <strong>Quy tắc cam kết an toàn:</strong> Dữ liệu chỉ được nạp vào hệ thống khi bạn nhấn nút
                    xác nhận bên dưới. Thao tác này sẽ ghi đè danh sách học sinh hiện tại và lưu vào lịch sử kiểm
                    toán.
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center justify-center cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleCommitImport}
                      disabled={validationResult.validRows.length === 0}
                      className="min-h-[44px] px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                    >
                      Xác nhận nạp {validationResult.validRows.length} học sinh
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
