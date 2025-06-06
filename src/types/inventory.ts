// Define common types for the inventory store
export interface Frame {
  id: string;
  brand: string;
  model: string;
  color: string;
  size?: string;
  price: number;
  stock: number;
}

export interface FrameItem {
  frameId: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  price: number;
  qty: number;
  createdAt: string;
}

export interface LensType {
  id: string;
  type: string;
  name: string;
  price: number;
  description?: string;
}

export interface LensCoating {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: "distance-reading" | "progressive" | "bifocal" | "sunglasses";
  isPhotochromic?: boolean;
  availableColors?: string[];
}

// WorkOrder type that is compatible with store/invoiceStore
export interface WorkOrder {
  id: string;
  patientId: string;
  workOrderId?: string;  // Made optional to match invoiceStore.WorkOrder
  invoiceId?: string;
  createdAt: string;
  
  // Frame details 
  frameBrand?: string;
  frameModel?: string;
  frameColor?: string;
  frameSize?: string;
  framePrice?: number;
  
  // Lens details - match the invoiceStore structure
  lensType?: string | { name: string; price: number };
  lensPrice?: number;
  
  // Coating
  coating?: string;
  coatingPrice?: number;
  
  // Service information for eye exams
  serviceName?: string;
  serviceId?: string;
  serviceDescription?: string;
  servicePrice?: number;
  
  // Pricing
  discount?: number;
  total?: number;
  
  // Status tracking
  isPaid?: boolean;
  isPickedUp?: boolean;
  pickedUpAt?: string;
  
  // Contact lens related
  contactLenses?: any[];
  contactLensRx?: any;
  
  // Edit tracking
  lastEditedAt?: string;
  editHistory?: Array<{
    timestamp: string;
    notes: string;
  }>;
  
  // Refund related
  isRefunded?: boolean;
  refundDate?: string;
}

// Utility type for converting between WorkOrder types, ensuring it's compatible with patientStore.WorkOrderEdit
export interface WorkOrderEdit {
  patientId: string;
  workOrderId: string;  // Required in patientStore.WorkOrderEdit
  invoiceId?: string;
  
  // Frame details
  frameBrand: string;
  frameModel: string;
  frameColor: string;
  frameSize?: string;
  framePrice: number;
  
  // Lens details
  lensType: string | { name: string; price: number };
  lensPrice: number;
  
  // Coating
  coating: string;
  coatingPrice: number;
  
  // Pricing
  discount: number;
  total: number;
  
  // Status tracking
  isPaid?: boolean;
  isPickedUp?: boolean;
  pickedUpAt?: string;
  
  // Additional fields for edit operations
  updatedData: any;  // Required in patientStore.WorkOrderEdit
  rxData?: any; // Adding rxData as a valid property
  
  // Other properties
  contactLenses?: any[];
  contactLensRx?: any;
  lastEditedAt?: string;
  editHistory?: Array<{ timestamp: string; notes: string }>;
  isRefunded?: boolean;
  refundDate?: string;
}
