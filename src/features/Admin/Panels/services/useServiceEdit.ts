import { useState, type FormEvent } from "react";
import type { Bilbord } from "../../../../entities/Bilbord/bilbord";
import { updateService, uploadServiceImageToCloudinary } from "../../../services";

type UseServiceEditOptions = {
  adminToken: string | null;
  loadServices: () => Promise<void>;
};

type EditServiceState = {
  title: string;
  description: string;
  size: string;
  price: string;
};

const initialEditServiceState: EditServiceState = {
  title: "",
  description: "",
  size: "",
  price: "",
};

export const useServiceEdit = ({ adminToken, loadServices }: UseServiceEditOptions) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState<Bilbord | null>(null);
  const [editService, setEditService] = useState<EditServiceState>(initialEditServiceState);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editImageObjectUrl, setEditImageObjectUrl] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleEditService = (resource: Bilbord) => {
    setEditingService(resource);
    setEditService({
      title: resource.title,
      description: resource.description,
      size: resource.size,
      price: String(resource.price),
    });
    setEditImageFile(null);
    setEditImagePreview(resource.imageUrl);
    setEditImageObjectUrl(null);
    setEditError(null);
    setShowEditModal(true);
  };

  const resetEditForm = () => {
    if (editImageObjectUrl) {
      URL.revokeObjectURL(editImageObjectUrl);
    }
    setEditingService(null);
    setEditService(initialEditServiceState);
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditImageObjectUrl(null);
    setEditError(null);
  };

  const handleCloseEditModal = () => {
    if (updating) return;
    setShowEditModal(false);
    resetEditForm();
  };

  const handleEditImageChange = (file: File | null) => {
    if (editImageObjectUrl) {
      URL.revokeObjectURL(editImageObjectUrl);
    }
    setEditImageFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setEditImageObjectUrl(objectUrl);
      setEditImagePreview(objectUrl);
    } else {
      setEditImageObjectUrl(null);
      setEditImagePreview(editingService?.imageUrl || null);
    }
  };

  const handleUpdateService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!adminToken) {
      setEditError("Токен администратора отсутствует");
      return;
    }

    if (!editingService) {
      setEditError("Не выбрана услуга для редактирования");
      return;
    }

    const priceNumber = Number(editService.price);
    if (
      !editService.title.trim() ||
      !editService.description.trim() ||
      !editService.size.trim() ||
      Number.isNaN(priceNumber) ||
      priceNumber <= 0
    ) {
      setEditError("Заполните все поля корректно");
      return;
    }

    const hasImage = Boolean(editImageFile || editImagePreview);
    if (!hasImage) {
      setEditError("Загрузите изображение услуги");
      return;
    }

    setUpdating(true);
    setEditError(null);

    try {
      const imageUrl = editImageFile ? await uploadServiceImageToCloudinary(editImageFile) : editImagePreview;

      if (!imageUrl) {
        setEditError("Не удалось определить изображение услуги");
        return;
      }

      await updateService(
        editingService.id,
        {
          title: editService.title.trim(),
          description: editService.description.trim(),
          size: editService.size.trim(),
          price: priceNumber,
          imageUrl,
        },
        adminToken,
      );

      await loadServices();
      setShowEditModal(false);
      resetEditForm();
    } catch (error) {
      console.error("Ошибка при обновлении услуги:", error);
      setEditError("Не удалось обновить услугу. Проверьте данные формы и настройки Cloudinary.");
    } finally {
      setUpdating(false);
    }
  };

  return {
    editError,
    editImagePreview,
    editService,
    handleCloseEditModal,
    handleEditImageChange,
    handleEditService,
    handleUpdateService,
    setEditService,
    showEditModal,
    updating,
  };
};