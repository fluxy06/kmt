import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { deleteService } from "../../../services";

type UseServiceDeleteOptions = {
  adminToken: string | null;
  loadServices: () => Promise<void>;
  selectedIds: number[];
  setSelectedIds: Dispatch<SetStateAction<number[]>>;
};

export const useServiceDelete = ({ adminToken, loadServices, selectedIds, setSelectedIds }: UseServiceDeleteOptions) => {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState<string | null>(null);
  const autoCloseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        window.clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  const handleOpenDeleteConfirm = () => {
    if (selectedIds.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    if (deleting) return;
    setShowDeleteConfirm(false);
  };

  const handleCloseDeleteSuccess = () => {
    setShowDeleteSuccess(false);
    setDeleteSuccessMessage(null);
  };

  const handleCloseDeleteError = () => {
    setShowDeleteError(false);
    setDeleteErrorMessage(null);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0 || !adminToken) return;

    const deleteCount = selectedIds.length;
    setDeleting(true);
    try {
      const deletePromises = selectedIds.map((id) => deleteService(id, adminToken));
      await Promise.all(deletePromises);

      await loadServices();
      setSelectedIds([]);

      setShowDeleteConfirm(false);
      setDeleteSuccessMessage(`Удалено карточек: ${deleteCount}`);
      setShowDeleteSuccess(true);

      if (autoCloseTimerRef.current) {
        window.clearTimeout(autoCloseTimerRef.current);
      }
      autoCloseTimerRef.current = window.setTimeout(() => {
        setShowDeleteSuccess(false);
        setDeleteSuccessMessage(null);
      }, 2200);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      setShowDeleteConfirm(false);
      setDeleteErrorMessage("Не удалось удалить карточки. Попробуйте еще раз.");
      setShowDeleteError(true);
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    deleteErrorMessage,
    deleteSuccessMessage,
    handleCloseDeleteConfirm,
    handleCloseDeleteError,
    handleCloseDeleteSuccess,
    handleDeleteSelected,
    handleOpenDeleteConfirm,
    showDeleteConfirm,
    showDeleteError,
    showDeleteSuccess,
  };
};
