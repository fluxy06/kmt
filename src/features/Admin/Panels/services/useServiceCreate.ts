import { useState, type FormEvent } from "react";
import { createService, uploadServiceImageToCloudinary } from "../../../services";
import type { Bilbord } from "../../../../entities/Bilbord/bilbord";

type UseServiceCreateOptions = {
  adminToken: string | null;
  loadServices: () => Promise<void>;
};

type NewServiceState = {
  title: string;
  description: string;
  size: string;
  price: string;
};

const initialNewServiceState: NewServiceState = {
  title: "",
  description: "",
  size: "",
  price: "",
};

export const useServiceCreate = ({ adminToken, loadServices }: UseServiceCreateOptions) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newService, setNewService] = useState<NewServiceState>(initialNewServiceState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const resetAddServiceForm = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setNewService(initialNewServiceState);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
  };

  const handleAddService = () => {
    setFormError(null);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (creating) return;
    setShowAddModal(false);
    resetAddServiceForm();
  };

  const handleImageChange = (file: File | null) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleCreateService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!adminToken) {
      setFormError("Токен администратора отсутствует");
      return;
    }

    if (!imageFile) {
      setFormError("Загрузите изображение услуги");
      return;
    }

    const priceNumber = Number(newService.price);
    if (
      !newService.title.trim() ||
      !newService.description.trim() ||
      !newService.size.trim() ||
      Number.isNaN(priceNumber) ||
      priceNumber <= 0
    ) {
      setFormError("Заполните все поля корректно");
      return;
    }

    setCreating(true);
    setFormError(null);

    try {
      const imageUrl = await uploadServiceImageToCloudinary(imageFile);

      await createService(
        {
          title: newService.title.trim(),
          description: newService.description.trim(),
          size: newService.size.trim(),
          price: priceNumber,
          imageUrl,
        } satisfies Omit<Bilbord, "id">,
        adminToken,
      );

      await loadServices();
      setShowAddModal(false);
      resetAddServiceForm();
    } catch (error) {
      console.error("Ошибка при добавлении услуги:", error);
      setFormError("Не удалось добавить услугу. Проверьте данные формы и настройки Cloudinary.");
    } finally {
      setCreating(false);
    }
  };

  return {
    creating,
    formError,
    handleAddService,
    handleCloseAddModal,
    handleCreateService,
    handleImageChange,
    imagePreview,
    newService,
    setNewService,
    showAddModal,
  };
};