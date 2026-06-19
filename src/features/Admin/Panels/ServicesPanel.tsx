import { useEffect, useState } from "react";
import { useAdminTheme } from "../AdminThemeContext";
import AddButton from "../../../shared/Buttons/AddButton";
import DeleteButton from "../../../shared/Buttons/DeleteButton";
import SearchBar from "../../../shared/SearchBar/SearchBar";
import BilInterAdmin from "../../BilInter/AdminUI/BilInterAdmin";
import ServiceSkeleton from "../../BilInter/ServiceSkeleton";
import type { Bilbord } from "../../../entities/Bilbord/bilbord";
import { fetchActiveServices, verifyAdminToken } from "../../services";
import ServiceAlertModal from "./services/ServiceAlertModal";
import { useServiceCreate } from "./services/useServiceCreate";
import { useServiceDelete } from "./services/useServiceDelete";
import { useServiceEdit } from "./services/useServiceEdit";

type ServicesPanelProps = {
  token?: string;
};

const ServicesPanel = ({ token }: ServicesPanelProps) => {
  const t = useAdminTheme();
  const surf = t.surface;
  const inputCls = `w-full px-4 py-2 border rounded-lg focus:outline-none ${t.input}`;
  const divCls = t.divider;

  const [services, setServices] = useState<Bilbord[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showEditBlockedAlert, setShowEditBlockedAlert] = useState(false);

  useEffect(() => {
    initializeAdmin();
  }, [token]);

  const extractTokenFromUrl = (): string | null => {
    const path = window.location.pathname;
    const parts = path.split("/");

    if (parts.length >= 4 && parts[2] === "admin") {
      return parts[3];
    }

    return null;
  };

  const initializeAdmin = async () => {
    try {
      setLoading(true);

      let activeToken = token || sessionStorage.getItem("adminToken");
      let tokenFromUrl = null;

      if (!activeToken) {
        tokenFromUrl = extractTokenFromUrl();
        if (tokenFromUrl) {
          activeToken = tokenFromUrl;
        }
      }

      if (activeToken) {
        const isValid = await verifyAdminToken(activeToken);

        if (isValid) {
          setAdminToken(activeToken);
          sessionStorage.setItem("adminToken", activeToken);

          await loadServices();
        } else {
          setTokenError("Недействительный токен администратора");
          sessionStorage.removeItem("adminToken");
        }
      } else {
        setTokenError("Токен администратора не найден. Пожалуйста, войдите снова.");
      }
    } catch (error) {
      console.error("Ошибка при инициализации админа:", error);
      setTokenError("Ошибка при проверке прав доступа");
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const data = await fetchActiveServices("no-store");
      setServices(data);
    } catch (error) {
      console.error("Ошибка при загрузке услуг:", error);
    }
  };

  const {
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
  } = useServiceCreate({ adminToken, loadServices });

  const {
    deleting,
    deleteSuccessMessage,
    handleCloseDeleteConfirm,
    handleCloseDeleteSuccess,
    handleDeleteSelected,
    handleOpenDeleteConfirm,
    showDeleteConfirm,
    showDeleteSuccess,
  } = useServiceDelete({
    adminToken,
    loadServices,
    selectedIds,
    setSelectedIds,
  });

  const {
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
  } = useServiceEdit({ adminToken, loadServices });

  const handleSelect = (resource: Bilbord) => {
    setSelectedIds((prev) => {
      if (prev.includes(resource.id)) {
        return prev.filter((id) => id !== resource.id);
      }
      return [...prev, resource.id];
    });
  };

  const handleEditWithSelection = (resource: Bilbord) => {
    if (selectedIds.length > 1) {
      setShowEditBlockedAlert(true);
      return;
    }
    handleEditService(resource);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.size && service.size.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  if (tokenError) {
    return (
      <section className="w-full h-full p-4 md:p-6">
        <div className={`text-4xl font-bold mb-8 font-[Montserrat_Alternates] ${t.text}`}>Управление услугами</div>

        <div className={`${surf} rounded-2xl p-8 text-center`}>
          <div className="text-red-400 text-xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.282 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            {tokenError}
          </div>
          <p className={`mb-6 ${t.subtext}`}>
            Перейдите по корректной ссылке администратора или обратитесь к системному администратору.
          </p>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="w-full h-full p-4 md:p-6">
        <div className={`text-4xl font-bold mb-8 font-[Montserrat_Alternates] ${t.text}`}>Управление услугами</div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <div className={`${surf} rounded-2xl p-4 space-y-6`}>
              <div className="animate-pulse space-y-4">
                <div className={`h-10 rounded ${t.isLight ? "bg-gray-200" : "bg-gray-700"}`}></div>
                <div className={`h-24 rounded ${t.isLight ? "bg-gray-200" : "bg-gray-700"}`}></div>
                <div className={`h-20 rounded ${t.isLight ? "bg-gray-200" : "bg-gray-700"}`}></div>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <div className={`${surf} rounded-2xl p-4`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index}>
                    <ServiceSkeleton />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full p-4 md:p-6">
      <div className="flex justify-between items-center mb-8">
        <div className={`text-4xl font-bold font-[Montserrat_Alternates] ${t.text}`}>Управление услугами</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className={`${surf} rounded-2xl p-4 space-y-6`}>
            <div className={`pb-4 border-b ${divCls}`}>
              <div className={`font-[Montserrat_Alternates] text-xl font-bold mb-1 ${t.text}`}>Администратор</div>
              <div className="text-green-400 text-xs truncate">
                Токен: {adminToken ? "Активен" : "Не установлен"}
              </div>
            </div>

            <div>
              <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Поиск</label>
              <SearchBar onSearch={handleSearch} placeholder="Поиск услуг..." />
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Действия</label>
                <div className="flex gap-3">
                  <AddButton onClick={handleAddService} />
                  <DeleteButton onClick={handleOpenDeleteConfirm} disabled={selectedIds.length === 0 || deleting} />
                </div>
              </div>

              {selectedIds.length > 0 && (
                <div className={`pt-4 border-t ${divCls}`}>
                  <div className="text-white text-center bg-[#44be32] shadow-2xl font-[Montserrat_Alternates] px-4 py-2 rounded-lg text-sm font-bold mb-2">
                    Выбрано: {selectedIds.length} карточек
                  </div>
                  <button
                    onClick={() => setSelectedIds([])}
                    className={`w-full px-4 py-2 font-[Montserrat_Alternates] rounded-lg text-sm transition-colors ${t.surface} ${t.text}`}
                    disabled={deleting}
                  >
                    Снять выделение
                  </button>
                </div>
              )}

              <div className={`pt-4 border-t ${divCls}`}>
                <div className={`text-sm space-y-1 font-[Montserrat_Alternates] ${t.subtext}`}>
                  <div className="font-[Montserrat_Alternates]">Всего услуг: {services.length}</div>
                  {searchQuery && <div>Найдено: {filteredServices.length}</div>}
                  {deleting && <div className="text-yellow-400 font-[Montserrat_Alternates] animate-pulse">Удаление...</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <div className={`${surf} rounded-2xl p-4`}>
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredServices.map((service) => (
                  <div key={service.id}>
                    <BilInterAdmin
                      resource={service}
                      isSelected={selectedIds.includes(service.id)}
                      onSelect={handleSelect}
                      onEdit={handleEditWithSelection}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className={`mb-4 ${t.subtext}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 mx-auto opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                {searchQuery ? (
                  <>
                    <h3 className={`text-xl font-bold mb-2 ${t.text}`}>Ничего не найдено</h3>
                    <p className={t.subtext}>Попробуйте изменить запрос поиска</p>
                  </>
                ) : (
                  <>
                    <h3 className={`text-xl font-bold mb-2 ${t.text}`}>Нет услуг</h3>
                    <p className={`mb-6 ${t.subtext}`}>Добавьте первую услугу</p>
                    <button
                      onClick={handleAddService}
                      className="px-6 py-3 bg-[#218E0B] hover:bg-[#31ea0c] text-white font-bold rounded-xl transition-colors"
                    >
                      Добавить услугу
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

  {showAddModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className={`w-full max-w-2xl rounded-2xl border border-[#44be32]/30 shadow-2xl ${surf}`}>
        <div className={`flex items-center justify-between border-b p-5 ${divCls}`}>
          <h3 className={`text-2xl font-bold font-[Montserrat_Alternates] ${t.text}`}>Новая услуга</h3>
          <button
            type="button"
            onClick={handleCloseAddModal}
            disabled={creating}
            className={`disabled:opacity-50 ${t.subtext} hover:${t.text}`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleCreateService} className="p-5 space-y-4">
          <div>
            <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Название</label>
            <input type="text" value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              className={inputCls} required />
          </div>
          <div>
            <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Описание</label>
            <textarea value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className={inputCls} rows={4} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Размер</label>
              <input type="text" value={newService.size}
                onChange={(e) => setNewService({ ...newService, size: e.target.value })}
                className={inputCls} required />
            </div>
            <div>
              <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Цена</label>
              <input type="number" value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                className={inputCls} required />
            </div>
          </div>
          <div>
            <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Изображение</label>
            <input type="file" accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              className={`w-full ${t.subtext}`} required />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 h-48 w-full object-cover rounded-lg" />
            )}
          </div>
          {formError && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">{formError}</div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleCloseAddModal} disabled={creating}
              className={`px-4 py-2 rounded-lg disabled:opacity-50 ${t.surface} ${t.text}`}>
              Отмена
            </button>
            <button type="submit" disabled={creating}
              className="px-5 py-2 rounded-lg bg-[#218E0B] hover:bg-[#31ea0c] text-white font-bold disabled:opacity-50">
              {creating ? "Сохранение..." : "Сохранить услугу"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
  {showEditModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className={`w-full max-w-2xl rounded-2xl border border-[#44be32]/30 shadow-2xl ${surf}`}>
        <div className={`flex items-center justify-between border-b p-5 ${divCls}`}>
          <div>
            <h3 className={`text-2xl font-bold font-[Montserrat_Alternates] ${t.text}`}>Редактирование услуги</h3>
            <p className={`text-xs mt-1 ${t.subtext}`}>Обновите данные и сохраните изменения</p>
          </div>
          <button
            type="button"
            onClick={handleCloseEditModal}
            disabled={updating}
            className={`disabled:opacity-50 ${t.subtext}`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleUpdateService} className="p-5 space-y-4">
          <div>
            <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Название</label>
            <input type="text" value={editService.title}
              onChange={(e) => setEditService({ ...editService, title: e.target.value })}
              className={inputCls} required />
          </div>
          <div>
            <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Описание</label>
            <textarea value={editService.description}
              onChange={(e) => setEditService({ ...editService, description: e.target.value })}
              className={inputCls} rows={4} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Размер</label>
              <input type="text" value={editService.size}
                onChange={(e) => setEditService({ ...editService, size: e.target.value })}
                className={inputCls} required />
            </div>
            <div>
              <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Цена</label>
              <input type="number" value={editService.price}
                onChange={(e) => setEditService({ ...editService, price: e.target.value })}
                className={inputCls} min="0" required />
            </div>
          </div>
          <div>
            <label className={`block font-[Montserrat_Alternates] text-sm font-medium mb-2 ${t.text}`}>Изображение</label>
            <input type="file" accept="image/*"
              onChange={(e) => handleEditImageChange(e.target.files?.[0] || null)}
              className={`w-full ${t.subtext}`} />
            {editImagePreview && (
              <img src={editImagePreview} alt="Preview" className="mt-4 h-48 w-full object-cover rounded-lg" />
            )}
          </div>
          {editError && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">{editError}</div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleCloseEditModal} disabled={updating}
              className={`px-4 py-2 rounded-lg disabled:opacity-50 ${t.surface} ${t.text}`}>
              Отмена
            </button>
            <button type="submit" disabled={updating}
              className="px-5 py-2 rounded-lg bg-[#218E0B] hover:bg-[#31ea0c] text-white font-bold disabled:opacity-50">
              {updating ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
  {showDeleteConfirm && (
    <ServiceAlertModal
      title="Подтвердите удаление"
      description={`Вы уверены, что хотите удалить выбранные карточки? Выбрано: ${selectedIds.length}.`}
      primaryLabel={deleting ? "Удаление..." : "Удалить"}
      secondaryLabel="Отмена"
      onPrimary={handleDeleteSelected}
      onSecondary={handleCloseDeleteConfirm}
      tone="warning"
      disableActions={deleting}
    />
  )}
  {showDeleteSuccess && (
    <ServiceAlertModal
      title="Карточки удалены"
      description={deleteSuccessMessage || "Карточки успешно удалены."}
      primaryLabel="Готово"
      onPrimary={handleCloseDeleteSuccess}
      tone="success"
    />
  )}
  {showEditBlockedAlert && (
    <ServiceAlertModal
      title="Редактирование недоступно"
      description="Выделено несколько карточек. Снимите выделение и выберите только одну карточку для редактирования."
      primaryLabel="Понятно"
      onPrimary={() => setShowEditBlockedAlert(false)}
      tone="warning"
    />
  )}
</section>
  );
};

export default ServicesPanel;
