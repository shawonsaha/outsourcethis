import React, { useState, useEffect } from "react";
import { useInventoryStore, ServiceItem } from "@/store/inventoryStore";
import { useLanguageStore } from "@/store/languageStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Pencil,
  Save,
  Trash2,
  Plus,
  X,
  FileText,
  Wrench,
  Stethoscope,
  Loader2,
} from "lucide-react";

export const ServiceManager: React.FC = () => {
  const { t, language } = useLanguageStore();
  const isRtl = language === "ar";
  const {
    services,
    addService,
    updateService,
    deleteService,
    fetchServices,
    isLoadingServices,
  } = useInventoryStore();

  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newService, setNewService] = useState<Omit<ServiceItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "exam",
  });

  const textAlignClass = isRtl ? "text-right" : "text-left";
  const directionClass = isRtl ? "rtl" : "ltr";

  useEffect(() => {
    // Fetch services when component mounts
    fetchServices();
  }, [fetchServices]);

  const resetNewService = () => {
    setNewService({
      name: "",
      description: "",
      price: 0,
      category: "exam",
    });
  };

  const handleAddService = async () => {
    if (!newService.name.trim()) {
      toast({
        title: t("error"),
        description: t("nameRequired"),
        variant: "destructive",
      });
      return;
    }

    if (newService.price < 0) {
      toast({
        title: t("error"),
        description: t("priceError"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addService(newService);
      resetNewService();
      setIsAddingNew(false);

      toast({
        description: t("serviceAdded"),
      });
    } catch (error) {
      console.error("Error adding service:", error);
      toast({
        title: t("error"),
        description: t("addServiceError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

    if (!editingService.name.trim()) {
      toast({
        title: t("error"),
        description: t("nameRequired"),
        variant: "destructive",
      });
      return;
    }

    if (editingService.price < 0) {
      toast({
        title: t("error"),
        description: t("priceError"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateService(editingService.id, {
        name: editingService.name,
        description: editingService.description,
        price: editingService.price,
        category: editingService.category,
      });

      setEditingService(null);

      toast({
        description: t("serviceUpdated"),
      });
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: t("error"),
        description: t("updateServiceError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm(t("confirmDelete"))) {
      setIsSubmitting(true);

      try {
        await deleteService(id);

        toast({
          description: t("serviceDeleted"),
        });
      } catch (error) {
        console.error("Error deleting service:", error);
        toast({
          title: t("error"),
          description: t("deleteServiceError"),
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "exam":
        return <Stethoscope className="w-4 h-4" />;
      case "repair":
        return <Wrench className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "exam":
        return isRtl ? "فحص العين" : t("eyeExam");
      case "repair":
        return isRtl ? "إصلاح" : t("repair");
      default:
        return isRtl ? "أخرى" : t("other");
    }
  };

  return (
    <div className={`space-y-6 ${textAlignClass}`} dir={directionClass}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("services")}</h3>
        <Button
          onClick={() => {
            resetNewService();
            setIsAddingNew(true);
          }}
          className="gap-1"
          disabled={isSubmitting || isLoadingServices}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {t("addService")}
        </Button>
      </div>

      {isAddingNew && (
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-primary">
                  {t("newService")}
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAddingNew(false)}
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newName" className="text-muted-foreground">
                  {t("name")}
                </Label>
                <Input
                  id="newName"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  className={textAlignClass}
                  placeholder={isRtl ? "فحص العين" : "Eye Exam"}
                  dir={directionClass}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="newDescription"
                  className="text-muted-foreground"
                >
                  {t("description")}
                </Label>
                <Input
                  id="newDescription"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  className={textAlignClass}
                  placeholder={
                    isRtl
                      ? "خدمة فحص العين القياسية لتقييم صحة العين والرؤية."
                      : "Standard eye examination service to evaluate eye health and vision."
                  }
                  dir={directionClass}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPrice" className="text-muted-foreground">
                    {t("price")}
                  </Label>
                  <Input
                    id="newPrice"
                    type="number"
                    min="0"
                    step="0.001"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={textAlignClass}
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newCategory"
                    className="text-muted-foreground"
                  >
                    {t("category")}
                  </Label>
                  <Select
                    value={newService.category}
                    onValueChange={(value) =>
                      setNewService({
                        ...newService,
                        category: value as ServiceItem["category"],
                      })
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="newCategory"
                      className={textAlignClass}
                      dir={directionClass}
                    >
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          <span>{isRtl ? "فحص العين" : t("eyeExam")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="repair">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4" />
                          <span>{isRtl ? "إصلاح" : t("repair")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{isRtl ? "أخرى" : t("other")}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAddService}
                className="w-full gap-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {t("saveService")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoadingServices ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {t("noServices")}
          </div>
        ) : (
          services.map((service) => (
            <Card
              key={service.id}
              className={`${
                editingService?.id === service.id ? "border-primary" : ""
              }`}
            >
              <CardContent className="pt-6">
                {editingService?.id === service.id ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-primary">
                        {t("editService")}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingService(null)}
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`name-${service.id}`}
                        className="text-muted-foreground"
                      >
                        {t("name")}
                      </Label>
                      <Input
                        id={`name-${service.id}`}
                        value={editingService.name}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            name: e.target.value,
                          })
                        }
                        className={textAlignClass}
                        dir={directionClass}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`desc-${service.id}`}
                        className="text-muted-foreground"
                      >
                        {t("description")}
                      </Label>
                      <Input
                        id={`desc-${service.id}`}
                        value={editingService.description}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            description: e.target.value,
                          })
                        }
                        className={textAlignClass}
                        dir={directionClass}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`price-${service.id}`}
                          className="text-muted-foreground"
                        >
                          {t("price")}
                        </Label>
                        <Input
                          id={`price-${service.id}`}
                          type="number"
                          min="0"
                          step="0.001"
                          value={editingService.price}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          className={textAlignClass}
                          dir="ltr"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor={`category-${service.id}`}
                          className="text-muted-foreground"
                        >
                          {t("category")}
                        </Label>
                        <Select
                          value={editingService.category}
                          onValueChange={(value) =>
                            setEditingService({
                              ...editingService,
                              category: value as ServiceItem["category"],
                            })
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            id={`category-${service.id}`}
                            className={textAlignClass}
                            dir={directionClass}
                          >
                            <SelectValue placeholder={t("selectCategory")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exam">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4" />
                                <span>
                                  {isRtl ? "فحص العين" : t("eyeExam")}
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="repair">
                              <div className="flex items-center gap-2">
                                <Wrench className="w-4 h-4" />
                                <span>{isRtl ? "إصلاح" : t("repair")}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="other">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{isRtl ? "أخرى" : t("other")}</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={handleUpdateService}
                      className="w-full gap-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {t("updateService")}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 text-primary p-2 rounded-full">
                          {getCategoryIcon(service.category)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-base">
                            {service.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {getCategoryName(service.category)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="font-semibold text-base">
                          {service.price.toFixed(3)} {isRtl ? "د.ك" : t("kwd")}
                        </div>
                      </div>
                    </div>

                    {service.description && (
                      <p
                        className={`mt-2 text-sm text-muted-foreground ${textAlignClass}`}
                        dir={directionClass}
                      >
                        {service.description}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingService(service)}
                        className="gap-1"
                        disabled={isSubmitting}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        {t("edit")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-destructive border-destructive hover:bg-destructive/10 gap-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        {t("delete")}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
