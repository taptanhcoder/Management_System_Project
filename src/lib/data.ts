// src/lib/data.ts

import { Prisma } from '@prisma/client';

// ===== USERS =====
export interface UserData {
  user_id?: number; // Optional, used if referencing directly. For createMany it's omitted.
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  password: string;
  created_at: Date;
}

export const usersData: UserData[] = [
  { full_name: 'Admin System',       email: 'admin@example.com',       phone: null,           role: 'admin',      password: '98765432', created_at: new Date('2024-05-01T08:00:00') },
  { full_name: 'Nguyễn Văn A',       email: 'nguyenvana@example.com',  phone: '0981234567',    role: 'doctor',     password: '12345678', created_at: new Date('2024-05-01T09:00:00') },
  { full_name: 'Trần Thị B',         email: 'tranthib@example.com',    phone: '0977654321',    role: 'doctor',     password: '23456789', created_at: new Date('2024-05-01T09:10:00') },
  { full_name: 'Lê Văn C',           email: 'levenac@example.com',     phone: '0912345678',    role: 'doctor',     password: '34567890', created_at: new Date('2024-05-01T09:20:00') },
  { full_name: 'Phạm Thị D',         email: 'phamthid@example.com',    phone: '0965432198',    role: 'patient',    password: '45678901', created_at: new Date('2024-05-01T10:00:00') },
  { full_name: 'Hoàng Văn E',        email: 'hoangvane@example.com',   phone: '0934567890',    role: 'patient',    password: '56789012', created_at: new Date('2024-05-01T10:10:00') },
  { full_name: 'Nguyễn Thị F',       email: 'nguyenthif@example.com',  phone: '0945678901',    role: 'patient',    password: '67890123', created_at: new Date('2024-05-01T10:20:00') },
  { full_name: 'Nhà Thuốc G',        email: 'nhathuocg@example.com',   phone: '0923456789',    role: 'pharmacy',   password: '78901234', created_at: new Date('2024-05-01T11:00:00') },
  { full_name: 'Nhà Thuốc H',        email: 'nhathuoch@example.com',   phone: '0956789012',    role: 'pharmacy',   password: '89012345', created_at: new Date('2024-05-01T11:10:00') },
  { full_name: 'Nhà Thuốc I',        email: 'nhathuoci@example.com',   phone: '0901234567',    role: 'pharmacy',   password: '90123456', created_at: new Date('2024-05-01T11:20:00') },
  { full_name: 'Trần Đức Anh',       email: 'tranducanh@example.com',  phone: '0911111111',    role: 'doctor',     password: '11223344', created_at: new Date('2024-05-02T08:00:00') },
  { full_name: 'Phạm Thị Hương',     email: 'phamthihuong@example.com',phone: '0922222222',    role: 'doctor',     password: '22334455', created_at: new Date('2024-05-02T08:10:00') },
  { full_name: 'Lê Minh Tuấn',       email: 'leminhtuan@example.com',  phone: '0933333333',    role: 'doctor',     password: '33445566', created_at: new Date('2024-05-02T08:20:00') },
  { full_name: 'Nguyễn Thanh Mai',   email: 'nguyenthanhmai@example.com', phone: '0944444444', role: 'doctor',  password: '44556677', created_at: new Date('2024-05-02T08:30:00') },
  { full_name: 'Hoàng Văn Bình',     email: 'hoangvanbinh@example.com', phone: '0955555555',    role: 'doctor',     password: '55667788', created_at: new Date('2024-05-02T08:40:00') },
  { full_name: 'Đặng Thị Lan',       email: 'dangthilan@example.com',  phone: '0966666666',    role: 'doctor',     password: '66778899', created_at: new Date('2024-05-02T08:50:00') },
  { full_name: 'Bùi Văn Quang',      email: 'buivanquang@example.com', phone: '0977777777',    role: 'doctor',     password: '77889900', created_at: new Date('2024-05-02T08:50:00') },
  { full_name: 'Trần Văn X',         email: 'tranvanx@example.com',    phone: '0987654321',    role: 'patient',    password: '11224455', created_at: new Date('2024-05-02T09:00:00') },
  { full_name: 'Lê Thị Y',           email: 'lethiy@example.com',      phone: '0976543210',    role: 'patient',    password: '22335566', created_at: new Date('2024-05-02T09:10:00') },
  { full_name: 'Phan Văn Z',         email: 'phanvanz@example.com',    phone: '0965432109',    role: 'patient',    password: '33446677', created_at: new Date('2024-05-02T09:20:00') },
  { full_name: 'Vũ Thị W',           email: 'vuthiw@example.com',      phone: '0954321098',    role: 'patient',    password: '44557788', created_at: new Date('2024-05-02T09:30:00') },
  { full_name: 'Đỗ Văn V',           email: 'dovv@example.com',        phone: '0943210987',    role: 'patient',    password: '55668899', created_at: new Date('2024-05-02T09:40:00') },
  { full_name: 'Hồ Thị U',           email: 'hothiu@example.com',      phone: '0932109876',    role: 'patient',    password: '66779900', created_at: new Date('2024-05-02T09:50:00') },
  { full_name: 'Ngô Văn T',          email: 'ngovant@example.com',     phone: '0921098765',    role: 'patient',    password: '77880011', created_at: new Date('2024-05-02T10:00:00') },
];

// ===== DOCTOR PROFILES =====
export interface DoctorProfileData {
  user_id: number;
  specialization?: string;
  license_number?: string;
}

export const doctorProfilesData: DoctorProfileData[] = [
  { user_id: 2,  specialization: 'Nội tổng quát',  license_number: 'DOC001' },
  { user_id: 3,  specialization: 'Ngoại',          license_number: 'DOC002' },
  { user_id: 4,  specialization: 'Da liễu',        license_number: 'DOC003' },
  { user_id: 11, specialization: 'Nhi khoa',       license_number: 'DOC004' },
  { user_id: 12, specialization: 'Sản phụ khoa',   license_number: 'DOC005' },
  { user_id: 13, specialization: 'Tim mạch',       license_number: 'DOC006' },
  { user_id: 14, specialization: 'Thần kinh',      license_number: 'DOC007' },
  { user_id: 15, specialization: 'Tai mũi họng',   license_number: 'DOC008' },
  { user_id: 16, specialization: 'Ung bướu',       license_number: 'DOC009' },
  { user_id: 17, specialization: 'Cơ xương khớp',  license_number: 'DOC010' },
];

// ===== PATIENT PROFILES =====
export interface PatientProfileData {
  user_id: number;
  date_of_birth: Date;
  gender: string;
  medical_history: string;
}

export const patientProfilesData: PatientProfileData[] = [
  { user_id: 5,  date_of_birth: new Date('1985-06-15'), gender: 'female', medical_history: 'Tiền sử dị ứng penicillin' },
  { user_id: 6,  date_of_birth: new Date('1990-12-03'), gender: 'male',   medical_history: 'Tiền sử cao huyết áp' },
  { user_id: 7,  date_of_birth: new Date('1978-09-20'), gender: 'female', medical_history: 'Không có tiền sử bệnh' },
  { user_id: 18, date_of_birth: new Date('2001-01-10'), gender: 'male',   medical_history: 'Tiền sử tiểu đường loại 2' },
  { user_id: 19, date_of_birth: new Date('1995-03-25'), gender: 'female', medical_history: 'Tiền sử hen suyễn' },
  { user_id: 20, date_of_birth: new Date('1988-07-30'), gender: 'male',   medical_history: 'Tiền sử mỡ máu cao' },
  { user_id: 21, date_of_birth: new Date('1992-11-18'), gender: 'female', medical_history: 'Không có tiền sử bệnh' },
  { user_id: 22, date_of_birth: new Date('1980-04-22'), gender: 'male',   medical_history: 'Tiền sử tim mạch' },
  { user_id: 23, date_of_birth: new Date('1975-08-05'), gender: 'female', medical_history: 'Tiền sử dị ứng thuốc' },
  { user_id: 24, date_of_birth: new Date('1983-02-14'), gender: 'male',   medical_history: 'Không có tiền sử bệnh' },
];

// ===== PHARMACIES =====
export interface PharmacyData {
  user_id: number;
  address: string;
  license_number: string;
}

export const pharmaciesData: PharmacyData[] = [
  { user_id: 8,  address: '123 Đường Láng, Hà Nội',    license_number: 'LIC123456' },
  { user_id: 9,  address: '456 Phố Huế, Hà Nội',       license_number: 'LIC789012' },
  { user_id: 10, address: '789 Nguyễn Trãi, Hà Nội',   license_number: 'LIC345678' },
];

// ===== MEDICINES =====
export interface MedicineData {
  name: string;
  description?: string;
  price: Prisma.Decimal;
}

export const medicinesData: MedicineData[] = [
  { name: 'Paracetamol',   description: 'Thuốc giảm đau, hạ sốt',             price: new Prisma.Decimal('5000.00') },
  { name: 'Ibuprofen',     description: 'Thuốc chống viêm, giảm đau',         price: new Prisma.Decimal('12000.00') },
  { name: 'Amoxicillin',   description: 'Kháng sinh phổ rộng',               price: new Prisma.Decimal('20000.00') },
  { name: 'Cetirizine',    description: 'Thuốc chống dị ứng',                 price: new Prisma.Decimal('15000.00') },
  { name: 'Omeprazole',    description: 'Thuốc giảm tiết acid dạ dày',       price: new Prisma.Decimal('25000.00') },
  { name: 'Metformin',     description: 'Thuốc điều trị tiểu đường',          price: new Prisma.Decimal('30000.00') },
  { name: 'Aspirin',       description: 'Thuốc giảm đau, chống đông máu',     price: new Prisma.Decimal('8000.00') },
  { name: 'Salbutamol',    description: 'Thuốc giãn phế quản',                price: new Prisma.Decimal('22000.00') },
  { name: 'Loratadine',    description: 'Thuốc chống dị ứng thế hệ mới',      price: new Prisma.Decimal('18000.00') },
  { name: 'Azithromycin',  description: 'Kháng sinh macrolide',               price: new Prisma.Decimal('35000.00') },
  { name: 'Diclofenac',    description: 'Thuốc chống viêm không steroid',    price: new Prisma.Decimal('15000.00') },
  { name: 'Simvastatin',   description: 'Thuốc giảm cholesterol máu',         price: new Prisma.Decimal('40000.00') },
  { name: 'Hydrochlorothiazide', description: 'Thuốc lợi tiểu',               price: new Prisma.Decimal('12000.00') },
  { name: 'Fluoxetine',    description: 'Thuốc chống trầm cảm',               price: new Prisma.Decimal('27000.00') },
  { name: 'Prednisone',    description: 'Thuốc corticosteroid',               price: new Prisma.Decimal('28000.00') },
  { name: 'Ciprofloxacin', description: 'Kháng sinh quinolone',               price: new Prisma.Decimal('32000.00') },
  { name: 'Diazepam',      description: 'Thuốc an thần, giãn cơ',             price: new Prisma.Decimal('20000.00') },
  { name: 'Ranitidine',    description: 'Thuốc giảm tiết acid dạ dày',       price: new Prisma.Decimal('15000.00') },
  { name: 'Clindamycin',   description: 'Kháng sinh lincosamide',             price: new Prisma.Decimal('34000.00') },
  { name: 'Metoprolol',    description: 'Thuốc điều trị tăng huyết áp',       price: new Prisma.Decimal('25000.00') },
];

// ===== BATCHES =====
export interface BatchData {
  medicine_id: number;
  batch_number: string;
  expiration_date: Date;
  stock: number;
}

export const batchesData: BatchData[] = [
  { medicine_id: 1,  batch_number: 'BATCH001', expiration_date: new Date('2025-12-31'), stock: 100 },
  { medicine_id: 2,  batch_number: 'BATCH001', expiration_date: new Date('2025-12-31'), stock: 50  },
  { medicine_id: 3,  batch_number: 'BATCH002', expiration_date: new Date('2024-06-30'), stock: 200 },
  { medicine_id: 4,  batch_number: 'BATCH003', expiration_date: new Date('2024-09-20'), stock: 80  },
  { medicine_id: 5,  batch_number: 'BATCH003', expiration_date: new Date('2024-09-20'), stock: 150 },
  { medicine_id: 6,  batch_number: 'BATCH004', expiration_date: new Date('2025-08-31'), stock: 130 },
  { medicine_id: 7,  batch_number: 'BATCH004', expiration_date: new Date('2025-08-31'), stock: 70  },
  { medicine_id: 8,  batch_number: 'BATCH004', expiration_date: new Date('2025-08-31'), stock: 90  },
  { medicine_id: 9,  batch_number: 'BATCH005', expiration_date: new Date('2024-11-30'), stock: 110 },
  { medicine_id: 10, batch_number: 'BATCH005', expiration_date: new Date('2024-11-30'), stock: 60  },
  { medicine_id: 11, batch_number: 'BATCH005', expiration_date: new Date('2024-11-30'), stock: 50  },
  { medicine_id: 12, batch_number: 'BATCH006', expiration_date: new Date('2025-01-15'), stock: 140 },
  { medicine_id: 13, batch_number: 'BATCH006', expiration_date: new Date('2025-01-15'), stock: 120 },
  { medicine_id: 14, batch_number: 'BATCH006', expiration_date: new Date('2025-01-15'), stock: 80  },
  { medicine_id: 15, batch_number: 'BATCH006', expiration_date: new Date('2025-01-15'), stock: 75  },
  { medicine_id: 16, batch_number: 'BATCH007', expiration_date: new Date('2024-12-20'), stock: 90  },
  { medicine_id: 17, batch_number: 'BATCH007', expiration_date: new Date('2024-12-20'), stock: 65  },
  { medicine_id: 18, batch_number: 'BATCH007', expiration_date: new Date('2024-12-20'), stock: 55  },
  { medicine_id: 19, batch_number: 'BATCH008', expiration_date: new Date('2025-03-10'), stock: 100 },
  { medicine_id: 20, batch_number: 'BATCH008', expiration_date: new Date('2025-03-10'), stock: 130 },
];

// ===== INVENTORY =====
export interface InventoryData {
  pharmacy_id: number;
  batch_id: number;
  stock_quantity: number;
}

export const inventoryData: InventoryData[] = [
  { pharmacy_id: 1, batch_id: 1,  stock_quantity: 50 },
  { pharmacy_id: 1, batch_id: 2,  stock_quantity: 30 },
  { pharmacy_id: 1, batch_id: 6,  stock_quantity: 40 },
  { pharmacy_id: 1, batch_id: 10, stock_quantity: 25 },
  { pharmacy_id: 2, batch_id: 3,  stock_quantity: 70 },
  { pharmacy_id: 2, batch_id: 4,  stock_quantity: 60 },
  { pharmacy_id: 2, batch_id: 7,  stock_quantity: 50 },
  { pharmacy_id: 2, batch_id: 11, stock_quantity: 20 },
  { pharmacy_id: 3, batch_id: 5,  stock_quantity: 80 },
  { pharmacy_id: 3, batch_id: 8,  stock_quantity: 40 },
  { pharmacy_id: 3, batch_id: 9,  stock_quantity: 60 },
  { pharmacy_id: 3, batch_id: 12, stock_quantity: 30 },
];

// ===== PRESCRIPTIONS =====
export interface PrescriptionData {
  doctor_id: number;
  patient_id: number;
  pharmacy_id: number | null;
  created_at: Date;
  status: string;
}

export const prescriptionsData: PrescriptionData[] = [
  { doctor_id: 1, patient_id: 5,  pharmacy_id: 1, created_at: new Date('2024-05-20T09:00:00'), status: 'pending'   },
  { doctor_id: 2, patient_id: 6,  pharmacy_id: 2, created_at: new Date('2024-05-21T10:15:00'), status: 'approved'  },
  { doctor_id: 3, patient_id: 7,  pharmacy_id: 3, created_at: new Date('2024-05-22T14:30:00'), status: 'completed' },
  { doctor_id: 4, patient_id: 8,  pharmacy_id: 1, created_at: new Date('2024-05-23T11:00:00'), status: 'pending'   },
  { doctor_id: 5, patient_id: 9,  pharmacy_id: 2, created_at: new Date('2024-05-24T13:45:00'), status: 'approved'  },
];

// ===== PRESCRIPTION DETAILS =====
export interface PrescriptionDetailData {
  prescription_id: number;
  medicine_id: number;
  dosage?: string;
  instructions?: string;
  quantity: number;
}

export const prescriptionDetailsData: PrescriptionDetailData[] = [
  { prescription_id: 1, medicine_id: 1,  dosage: '500mg', instructions: 'Uống sau khi ăn, 2 lần/ngày', quantity: 10 },
  { prescription_id: 1, medicine_id: 3,  dosage: '250mg', instructions: 'Uống trước khi đi ngủ',        quantity: 5  },
  { prescription_id: 2, medicine_id: 2,  dosage: '200mg', instructions: 'Uống 1 lần/ngày',             quantity: 20 },
  { prescription_id: 2, medicine_id: 5,  dosage: '20mg',  instructions: 'Uống sáng trước ăn',         quantity: 15 },
  { prescription_id: 3, medicine_id: 4,  dosage: '10mg',  instructions: 'Uống khi cần',              quantity: 7  },
  { prescription_id: 3, medicine_id: 6,  dosage: '850mg', instructions: 'Uống sau ăn sáng',          quantity: 30 },
  { prescription_id: 4, medicine_id: 7,  dosage: '400mg', instructions: 'Uống sáng và tối',          quantity: 25 },
  { prescription_id: 4, medicine_id: 8,  dosage: '100mg', instructions: 'Uống sau bữa trưa',         quantity: 10 },
  { prescription_id: 5, medicine_id: 9,  dosage: '10mg',  instructions: 'Uống trước khi ngủ',         quantity: 12 },
  { prescription_id: 5, medicine_id: 10, dosage: '200mg', instructions: 'Uống khi đau',               quantity: 8  },
];

// ===== ORDERS =====
export interface OrderData {
  patient_id: number;
  pharmacy_id: number;
  total_price: Prisma.Decimal;
  order_date: Date;
  status: string;
}

export const ordersData: OrderData[] = [
  { patient_id: 1, pharmacy_id: 1, total_price: new Prisma.Decimal('150000'), order_date: new Date('2024-05-25T08:00:00'), status: 'pending'   },
  { patient_id: 2, pharmacy_id: 2, total_price: new Prisma.Decimal('230000'), order_date: new Date('2024-05-25T09:30:00'), status: 'shipped'   },
  { patient_id: 3, pharmacy_id: 3, total_price: new Prisma.Decimal('120000'), order_date: new Date('2024-05-25T10:00:00'), status: 'delivered' },
  { patient_id: 4, pharmacy_id: 1, total_price: new Prisma.Decimal('180000'), order_date: new Date('2024-05-25T11:15:00'), status: 'pending'   },
  { patient_id: 5, pharmacy_id: 2, total_price: new Prisma.Decimal('250000'), order_date: new Date('2024-05-25T12:45:00'), status: 'shipped'   },
  { patient_id: 6, pharmacy_id: 3, total_price: new Prisma.Decimal('210000'), order_date: new Date('2024-05-25T13:30:00'), status: 'delivered' },
  { patient_id: 7, pharmacy_id: 1, total_price: new Prisma.Decimal('175000'), order_date: new Date('2024-05-25T14:20:00'), status: 'pending'   },
  { patient_id: 8, pharmacy_id: 2, total_price: new Prisma.Decimal('195000'), order_date: new Date('2024-05-25T15:10:00'), status: 'shipped'   },
];

// ===== ORDER DETAILS =====
export interface OrderDetailData {
  order_id: number;
  medicine_id: number;
  quantity: number;
  price: Prisma.Decimal;
}

export const orderDetailsData: OrderDetailData[] = [
  // Order 1
  { order_id: 1, medicine_id: 1,  quantity: 10, price: new Prisma.Decimal('5000')  },
  { order_id: 1, medicine_id: 3,  quantity: 5,  price: new Prisma.Decimal('20000') },

  // Order 2
  { order_id: 2, medicine_id: 2,  quantity: 8,  price: new Prisma.Decimal('12000') },
  { order_id: 2, medicine_id: 5,  quantity: 4,  price: new Prisma.Decimal('25000') },

  // Order 3
  { order_id: 3, medicine_id: 4,  quantity: 7,  price: new Prisma.Decimal('15000') },
  { order_id: 3, medicine_id: 6,  quantity: 3,  price: new Prisma.Decimal('30000') },

  // Order 4
  { order_id: 4, medicine_id: 7,  quantity: 5,  price: new Prisma.Decimal('8000')  },
  { order_id: 4, medicine_id: 8,  quantity: 2,  price: new Prisma.Decimal('22000') },

  // Order 5
  { order_id: 5, medicine_id: 9,  quantity: 6,  price: new Prisma.Decimal('18000') },
  { order_id: 5, medicine_id: 10, quantity: 3,  price: new Prisma.Decimal('35000') },

  // Order 6
  { order_id: 6, medicine_id: 11, quantity: 4,  price: new Prisma.Decimal('15000') },
  { order_id: 6, medicine_id: 12, quantity: 2,  price: new Prisma.Decimal('40000') },

  // Order 7
  { order_id: 7, medicine_id: 13, quantity: 5,  price: new Prisma.Decimal('12000') },
  { order_id: 7, medicine_id: 14, quantity: 3,  price: new Prisma.Decimal('27000') },

  // Order 8
  { order_id: 8, medicine_id: 15, quantity: 2,  price: new Prisma.Decimal('28000') },
  { order_id: 8, medicine_id: 16, quantity: 4,  price: new Prisma.Decimal('20000') },
];
