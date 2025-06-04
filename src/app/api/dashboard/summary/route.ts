// src/app/api/dashboard/summary/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Tổng số thuốc (count trên table Drug)
    const totalMedicines = await prisma.drug.count();

    // 2. Tổng số nhóm thuốc (count trên Category)
    const medicineGroups = await prisma.category.count();

    // 3. Số thuốc đã hết hạn (expiryDate < now)
    const now = new Date();
    const lowStockExpired = await prisma.drug.count({
      where: { expiryDate: { lt: now } },
    });

    // 4. Số thuốc tồn thấp: threshold giả định 10
    const LOW_THRESHOLD = 10;
    const lowStockCount = await prisma.drug.count({
      where: { quantity: { lte: LOW_THRESHOLD } },
    });

    // 5. Tính soldToday: tổng quantity của PrescriptionItem
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const soldAgg = await prisma.prescriptionItem.aggregate({
      _sum: { quantity: true },
      where: {
        prescription: {
          createdAt: { gte: todayStart, lte: todayEnd },
          status: "CONFIRMED",
        },
      },
    });
    const soldToday = soldAgg._sum.quantity || 0;

    // 6. Tính receivedToday: tổng quantity (Drug) tạo hôm nay
    const receivedAgg = await prisma.drug.aggregate({
      _sum: { quantity: true },
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    });
    const receivedToday = receivedAgg._sum.quantity || 0;

    // 7. Tính doanh thu tháng này (tổng invoice.total của paid invoices từ đầu tháng đến giờ):
    const nowDate = new Date();
    const startOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
    const endOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0, 23, 59, 59);

    const revenueAgg = await prisma.invoice.aggregate({
      _sum: { total: true },
      where: {
        date: { gte: startOfMonth, lte: endOfMonth },
        status: "PAID",
      },
    });
    const revenueThisMonth = revenueAgg._sum.total || 0;

    // 8. Tính chi phí tháng này: ta sẽ dùng tổng purchasePrice của Drug nhập trong tháng (chỉ ví dụ)
    const expenseAgg = await prisma.drug.aggregate({
      _sum: { purchasePrice: true },
      where: {
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });
    const expenseThisMonth = expenseAgg._sum.purchasePrice || 0;

    // 9. Tổng số employees: đếm user có role = "ADMIN" (giả định Admin là nhân viên, hoặc bạn có thể thêm role "PHARMACIST")
    const totalEmployees = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    // 10. Tổng số customers:
    const totalCustomers = await prisma.customer.count();

    // 11. Tổng số suppliers (dựa vào bảng Drug.supplier là string, hoặc nếu bạn có table riêng, nhưng theo schema không có table Supplier. 
    //      Ở đây giả định “supplier” chỉ là string, nên ta count distinct supplier trong Drug)
    const suppliersList = await prisma.drug.findMany({
      select: { supplier: true },
      distinct: ["supplier"],
    });
    const totalSuppliers = suppliersList.length;

    // 12. Top Selling Item: tìm drugId có tổng quantity lớn nhất
    const topItemGroup = await prisma.prescriptionItem.groupBy({
      by: ["drugId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 1,
    });
    let frequentItem = "N/A";
    if (topItemGroup.length > 0) {
      const topDrug = await prisma.drug.findUnique({
        where: { id: topItemGroup[0].drugId },
      });
      frequentItem = topDrug?.name || "N/A";
    }

    // 13. Số hóa đơn hôm nay (invoicesToday)
    const invoicesToday = await prisma.invoice.count({
      where: {
        date: { gte: todayStart, lte: todayEnd },
      },
    });

    // 14. Xác định inventoryStatus
    const inventoryStatus = lowStockCount > 0 ? "Warning" : "Good";

    // Kết quả trả về
    const result = {
      inventoryStatus,
      totalMedicines,
      medicineGroups,
      receivedToday,
      soldToday,
      revenueThisMonth,
      expenseThisMonth,
      lowStockCount,
      lowStockExpired,
      totalEmployees,
      totalCustomers,
      totalSuppliers,
      frequentItem,
      invoicesToday,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/dashboard/summary:", error);
    return NextResponse.json({ error: "Cannot fetch dashboard summary" }, { status: 500 });
  }
}
