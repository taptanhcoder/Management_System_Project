import { user_role } from '@prisma/client';

export const users = [
  {
    full_name: 'Nguyễn Văn A',
    email: 'a@gmail.com',
    phone: '0123456789',
    role: user_role.patient,
    password: 'hashed_password',
  },
  {
    full_name: 'Bác sĩ Bình',
    email: 'doctor@gmail.com',
    phone: '0987654321',
    role: user_role.doctor,
    password: 'hashed_password2',
  },
];

export const medicines = [
  {
    name: 'Paracetamol',
    description: 'Thuốc hạ sốt giảm đau',
    price: 12000,
  },
  {
    name: 'Amoxicillin',
    description: 'Thuốc kháng sinh phổ rộng',
    price: 20000,
  },
];
