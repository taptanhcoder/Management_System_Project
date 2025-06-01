import { Role, PrescriptionStatus, InvoiceStatus } from "@prisma/client";

export interface UserSeed {
  email: string;
  passwordHash: string;
  name?: string | null;
  role: Role;
}

/**
 * Dữ liệu người dùng mẫu.
 * passwordHash cần là hash (ví dụ bcrypt), không phải plaintext.
 */
export const usersData: UserSeed[] = [
  {
    email: "admin@example.com",
    passwordHash: "$2b$10$abcdefghijklmnopqrstuv",
    name: "Admin System",
    role: Role.ADMIN,
  },
  {
    email: "pharmacist1@example.com",
    passwordHash: "$2b$10$qrstuvwxyzabcdefghijk",
    name: "Pharmacist One",
    role: Role.USER,
  },
  {
    email: "pharmacist2@example.com",
    passwordHash: "$2b$10$1234567890abcdefghijkl",
    name: "Pharmacist Two",
    role: Role.USER,
  },
  {
    email: "pharmacist3@example.com",
    passwordHash: "$2b$10$lmnopqrstuvwxzy1234567",
    name: "Pharmacist Three",
    role: Role.USER,
  },
  {
    email: "pharmacist4@example.com",
    passwordHash: "$2b$10$ABCDEFGHJKLMNOPQRSTUV",
    name: "Pharmacist Four",
    role: Role.USER,
  },
  {
    email: "pharmacist5@example.com",
    passwordHash: "$2b$10$ZYXWVUTSRQPONMLKJIHGF",
    name: "Pharmacist Five",
    role: Role.USER,
  },
];

export interface CategorySeed {
  name: string;
  description: string;
}

/**
 * Dữ liệu danh mục thuốc mẫu.
 */
export const categoriesData: CategorySeed[] = [
  { name: "Kháng sinh",      description: "Các loại kháng sinh phổ rộng và phổ hẹp" },
  { name: "Giảm đau",        description: "Thuốc giảm đau, hạ sốt thông dụng" },
  { name: "Thuốc tim mạch",  description: "Thuốc điều trị các bệnh tim mạch" },
  { name: "Thuốc tiêu hóa",  description: "Thuốc hỗ trợ tiêu hóa, giảm acid dạ dày" },
  { name: "Bổ sung",         description: "Vitamin, khoáng chất và thực phẩm chức năng" },
  { name: "Thuốc hô hấp",    description: "Thuốc cho bệnh hô hấp, hen suyễn" },
  { name: "Thuốc nội tiết",  description: "Thuốc liên quan đến hệ nội tiết, tiểu đường" },
  { name: "Thuốc thần kinh", description: "Thuốc điều trị bệnh thần kinh, an thần" },
];

export interface DrugSeed {
  name: string;
  categoryId: string; // Ở đây phải là tên của category, vì seed.ts sẽ lookup categoryMap.get(categoryId)
  quantity: number;
  expiryDate: Date;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  description?: string | null;
}

/**
 * Dữ liệu thuốc mẫu.
 * categoryId = tên của danh mục, trùng với một trong các name trong categoriesData
 */
export const drugsData: DrugSeed[] = [
  {
    name: "Amoxicillin 500mg",
    categoryId: "Kháng sinh",
    quantity: 100,
    expiryDate: new Date("2025-12-31"),
    supplier: "Nhà cung cấp A",
    purchasePrice: 5000,
    sellingPrice: 8000,
    description: "Viên nang Amoxicillin 500mg",
  },
  {
    name: "Paracetamol 500mg",
    categoryId: "Giảm đau",
    quantity: 200,
    expiryDate: new Date("2026-06-30"),
    supplier: "Nhà cung cấp B",
    purchasePrice: 2000,
    sellingPrice: 3500,
    description: "Viên nén Paracetamol 500mg",
  },
  {
    name: "Atorvastatin 20mg",
    categoryId: "Thuốc tim mạch",
    quantity: 150,
    expiryDate: new Date("2025-10-15"),
    supplier: "Nhà cung cấp C",
    purchasePrice: 15000,
    sellingPrice: 22000,
    description: "Viên nén Atorvastatin 20mg",
  },
  {
    name: "Pantoprazole 40mg",
    categoryId: "Thuốc tiêu hóa",
    quantity: 120,
    expiryDate: new Date("2025-08-31"),
    supplier: "Nhà cung cấp D",
    purchasePrice: 12000,
    sellingPrice: 18000,
    description: "Viên nén Pantoprazole 40mg",
  },
  {
    name: "Vitamin C 500mg",
    categoryId: "Bổ sung",
    quantity: 300,
    expiryDate: new Date("2026-01-01"),
    supplier: "Nhà cung cấp E",
    purchasePrice: 1000,
    sellingPrice: 1500,
    description: "Viên nén Vitamin C 500mg",
  },
  {
    name: "Ventolin Inhaler",
    categoryId: "Thuốc hô hấp",
    quantity: 80,
    expiryDate: new Date("2025-11-30"),
    supplier: "Nhà cung cấp F",
    purchasePrice: 50000,
    sellingPrice: 75000,
    description: "Thuốc xịt co thắt phế quản Salbutamol",
  },
  {
    name: "Metformin 500mg",
    categoryId: "Thuốc nội tiết",
    quantity: 180,
    expiryDate: new Date("2025-09-20"),
    supplier: "Nhà cung cấp G",
    purchasePrice: 3000,
    sellingPrice: 5000,
    description: "Viên nén Metformin 500mg điều trị tiểu đường",
  },
  {
    name: "Fluoxetine 20mg",
    categoryId: "Thuốc thần kinh",
    quantity: 60,
    expiryDate: new Date("2026-03-15"),
    supplier: "Nhà cung cấp H",
    purchasePrice: 27000,
    sellingPrice: 38000,
    description: "Viên nén Fluoxetine 20mg chống trầm cảm",
  },
  {
    name: "Omeprazole 20mg",
    categoryId: "Thuốc tiêu hóa",
    quantity: 140,
    expiryDate: new Date("2025-12-10"),
    supplier: "Nhà cung cấp I",
    purchasePrice: 12000,
    sellingPrice: 18000,
    description: "Viên nén Omeprazole 20mg giảm tiết acid dạ dày",
  },
  {
    name: "Loratadine 10mg",
    categoryId: "Giảm đau",
    quantity: 100,
    expiryDate: new Date("2026-02-28"),
    supplier: "Nhà cung cấp J",
    purchasePrice: 18000,
    sellingPrice: 26000,
    description: "Viên nén Loratadine 10mg chống dị ứng",
  },
];

export interface CustomerSeed {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string | null;
}

/**
 * Dữ liệu khách hàng mẫu.
 */
export const customersData: CustomerSeed[] = [
  {
    name: "Nguyễn Văn A",
    phone: "0909123456",
    email: "nguyenvana@example.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    notes: "Dị ứng Penicillin",
  },
  {
    name: "Trần Thị B",
    phone: "0912345678",
    email: "tranthib@example.com",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    notes: null,
  },
  {
    name: "Lê Thị C",
    phone: "0933456789",
    email: "lethic@example.com",
    address: "789 Đường 123, Quận 5, TP.HCM",
    notes: "Tiền sử cao huyết áp",
  },
  {
    name: "Phạm Văn D",
    phone: "0944567890",
    email: "phamvand@example.com",
    address: "321 Đường QWE, Quận 2, TP.HCM",
    notes: "Tiền sử tiểu đường",
  },
  {
    name: "Hoàng Thị E",
    phone: "0955678901",
    email: "hoangthie@example.com",
    address: "654 Đường RTY, Quận 7, TP.HCM",
    notes: "Không có tiền sử bệnh",
  },
  {
    name: "Trần Văn F",
    phone: "0966789012",
    email: "tranvanf@example.com",
    address: "987 Đường UIO, Quận Bình Thạnh, TP.HCM",
    notes: "Dị ứng thuốc giảm đau",
  },
  {
    name: "Lê Văn G",
    phone: "0977890123",
    email: "levang@example.com",
    address: "159 Đường ASDF, Quận Tân Bình, TP.HCM",
    notes: null,
  },
  {
    name: "Vũ Thị H",
    phone: "0988901234",
    email: "vuthih@example.com",
    address: "753 Đường ZXCV, Quận Phú Nhuận, TP.HCM",
    notes: "Tiền sử mỡ máu cao",
  },
];

export interface PrescriptionSeed {
  customer: string;        // Tên khách hàng (trùng với customersData.name)
  date: Date;
  status: PrescriptionStatus;
  total: number;
  createdById?: string;    // Ở đây dùng email, seed.ts lookup userMap.get(createdById)
}

export const prescriptionsData: PrescriptionSeed[] = [
  {
    customer: "Nguyễn Văn A",
    date: new Date("2025-05-10T09:00:00Z"),
    status: PrescriptionStatus.PENDING,
    total: 0,
    createdById: "pharmacist1@example.com",
  },
  {
    customer: "Trần Thị B",
    date: new Date("2025-05-11T10:30:00Z"),
    status: PrescriptionStatus.CONFIRMED,
    total: 50000,
    createdById: "pharmacist2@example.com",
  },
  {
    customer: "Lê Thị C",
    date: new Date("2025-05-12T14:45:00Z"),
    status: PrescriptionStatus.PENDING,
    total: 0,
    createdById: "pharmacist3@example.com",
  },
  {
    customer: "Phạm Văn D",
    date: new Date("2025-05-13T08:15:00Z"),
    status: PrescriptionStatus.CONFIRMED,
    total: 120000,
    createdById: "pharmacist4@example.com",
  },
  {
    customer: "Hoàng Thị E",
    date: new Date("2025-05-14T11:20:00Z"),
    status: PrescriptionStatus.PENDING,
    total: 0,
    createdById: "pharmacist5@example.com",
  },
  {
    customer: "Trần Văn F",
    date: new Date("2025-05-15T16:00:00Z"),
    status: PrescriptionStatus.CONFIRMED,
    total: 80000,
    createdById: "pharmacist1@example.com",
  },
];

export interface PrescriptionItemSeed {
  prescriptionId: string; // Dùng prescriptionKey = customer + date.toISOString()
  drugId: string;         // Ở đây dùng tên thuốc, seed.ts lookup drugMap.get(drugId)
  quantity: number;
  unitPrice: number;
}

/**
 * Dữ liệu chi tiết đơn kê mẫu.
 * prescriptionId = customer + date.toISOString() (giống cách seed.ts set key)
 * drugId = tên thuốc (ví dụ "Amoxicillin 500mg")
 */
export const prescriptionItemsData: PrescriptionItemSeed[] = [
  {
    prescriptionId: "Nguyễn Văn A2025-05-10T09:00:00.000Z",
    drugId: "Amoxicillin 500mg",
    quantity: 10,
    unitPrice: 8000,
  },
  {
    prescriptionId: "Nguyễn Văn A2025-05-10T09:00:00.000Z",
    drugId: "Paracetamol 500mg",
    quantity: 5,
    unitPrice: 3500,
  },
  {
    prescriptionId: "Trần Thị B2025-05-11T10:30:00.000Z",
    drugId: "Atorvastatin 20mg",
    quantity: 20,
    unitPrice: 22000,
  },
  {
    prescriptionId: "Trần Thị B2025-05-11T10:30:00.000Z",
    drugId: "Pantoprazole 40mg",
    quantity: 15,
    unitPrice: 18000,
  },
  {
    prescriptionId: "Phạm Văn D2025-05-13T08:15:00.000Z",
    drugId: "Vitamin C 500mg",
    quantity: 12,
    unitPrice: 1500,
  },
  {
    prescriptionId: "Phạm Văn D2025-05-13T08:15:00.000Z",
    drugId: "Metformin 500mg",
    quantity: 8,
    unitPrice: 5000,
  },
  {
    prescriptionId: "Trần Văn F2025-05-15T16:00:00.000Z",
    drugId: "Fluoxetine 20mg",
    quantity: 5,
    unitPrice: 38000,
  },
  {
    prescriptionId: "Trần Văn F2025-05-15T16:00:00.000Z",
    drugId: "Omeprazole 20mg",
    quantity: 7,
    unitPrice: 18000,
  },
];

export interface InvoiceSeed {
  customerId: string;     // Ở đây dùng tên khách, seed.ts lookup customerMap.get(customerId)
  date: Date;
  status: InvoiceStatus;
  total: number;
  createdById?: string;   // Dùng email, seed.ts lookup userMap.get(createdById)
}

export const invoicesData: InvoiceSeed[] = [
  {
    customerId: "Nguyễn Văn A",
    date: new Date("2025-05-12T14:00:00Z"),
    status: InvoiceStatus.UNPAID,
    total: 80000,
    createdById: "pharmacist1@example.com",
  },
  {
    customerId: "Trần Thị B",
    date: new Date("2025-05-13T09:30:00Z"),
    status: InvoiceStatus.PAID,
    total: 35000,
    createdById: "pharmacist2@example.com",
  },
  {
    customerId: "Lê Thị C",
    date: new Date("2025-05-14T10:15:00Z"),
    status: InvoiceStatus.UNPAID,
    total: 120000,
    createdById: "pharmacist3@example.com",
  },
  {
    customerId: "Phạm Văn D",
    date: new Date("2025-05-15T11:45:00Z"),
    status: InvoiceStatus.PAID,
    total: 150000,
    createdById: "pharmacist4@example.com",
  },
  {
    customerId: "Hoàng Thị E",
    date: new Date("2025-05-16T13:20:00Z"),
    status: InvoiceStatus.UNPAID,
    total: 60000,
    createdById: "pharmacist5@example.com",
  },
  {
    customerId: "Vũ Thị H",
    date: new Date("2025-05-17T15:00:00Z"),
    status: InvoiceStatus.PAID,
    total: 90000,
    createdById: "pharmacist1@example.com",
  },
];

export interface InvoiceItemSeed {
  invoiceId: string; // Ở đây dùng invoiceKey = customerId + date.toISOString()
  drugId: string;    // Dùng tên thuốc, seed.ts lookup drugMap.get(drugId)
  quantity: number;
  unitPrice: number;
}

/**
 * Dữ liệu chi tiết hóa đơn mẫu.
 * invoiceId = customerId + date.toISOString()
 * drugId = tên thuốc (ví dụ "Amoxicillin 500mg")
 */
export const invoiceItemsData: InvoiceItemSeed[] = [
  {
    invoiceId: "Nguyễn Văn A2025-05-12T14:00:00.000Z",
    drugId: "Amoxicillin 500mg",
    quantity: 10,
    unitPrice: 8000,
  },
  {
    invoiceId: "Trần Thị B2025-05-13T09:30:00.000Z",
    drugId: "Paracetamol 500mg",
    quantity: 5,
    unitPrice: 3500,
  },
  {
    invoiceId: "Lê Thị C2025-05-14T10:15:00.000Z",
    drugId: "Atorvastatin 20mg",
    quantity: 8,
    unitPrice: 22000,
  },
  {
    invoiceId: "Lê Thị C2025-05-14T10:15:00.000Z",
    drugId: "Metformin 500mg",
    quantity: 3,
    unitPrice: 5000,
  },
  {
    invoiceId: "Phạm Văn D2025-05-15T11:45:00.000Z",
    drugId: "Pantoprazole 40mg",
    quantity: 12,
    unitPrice: 18000,
  },
  {
    invoiceId: "Hoàng Thị E2025-05-16T13:20:00.000Z",
    drugId: "Vitamin C 500mg",
    quantity: 20,
    unitPrice: 1500,
  },
  {
    invoiceId: "Vũ Thị H2025-05-17T15:00:00.000Z",
    drugId: "Ventolin Inhaler",
    quantity: 6,
    unitPrice: 75000,
  },
  {
    invoiceId: "Vũ Thị H2025-05-17T15:00:00.000Z",
    drugId: "Fluoxetine 20mg",
    quantity: 2,
    unitPrice: 38000,
  },
];
