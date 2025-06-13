"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Customer { id: string; name: string }
interface Drug { id: string; name: string; sellingPrice: number }
interface PrescriptionOption { id: string; customer: string }
interface ItemLine { drugId: string; quantity: number; unitPrice: number }

interface InvoiceFormProps {
  initialData?: {
    id: string;
    customerId?: string;
    date: string;
    status: "PAID" | "UNPAID";
    items: ItemLine[];
  };
}

export default function InvoiceForm({ initialData }: InvoiceFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [prescriptionId, setPrescriptionId] = useState("");
  const [customerId, setCustomerId] = useState(initialData?.customerId || "");
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().slice(0,10));
  const [status, setStatus] = useState<"PAID"|"UNPAID">(initialData?.status || "UNPAID");
  const [items, setItems] = useState<ItemLine[]>(
    initialData?.items.map(it => ({ ...it })) || [{ drugId:"", quantity:1, unitPrice:0 }]
  );

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [presList, setPresList] = useState<PrescriptionOption[]>([]);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  // Load dropdowns
  useEffect(() => {
    Promise.all([
      fetch("/api/customers").then(r => r.json()),
      fetch("/api/inventory").then(r => r.json()),
      fetch("/api/prescriptions?status=PENDING").then(r => r.json())
    ]).then(([cus, drg, pres])=>{
      setCustomers(cus);
      setDrugs(drg.map((d:any)=>({ id:d.id, name:d.name, sellingPrice:d.sellingPrice })));
      setPresList(pres);
    });
  }, []);

  // Khi chọn prescription, tự fill items và set customerName
  useEffect(()=>{
    if(!prescriptionId) return;
    fetch(`/api/prescriptions/${prescriptionId}`)
      .then(r=>r.json())
      .then((pres:any)=>{
        setItems(pres.items.map((it:any)=>({
          drugId: it.drugId,
          quantity: it.quantity,
          unitPrice: it.unitPrice
        })));
        setCustomerName(pres.customer);
        setCustomerId("");
      });
  },[prescriptionId]);

  // Cập nhật items
  const updateItem = (idx:number, field:"drugId"|"quantity", val:string)=>{
    setItems(old=>old.map((it,i)=>{
      if(i!==idx) return it;
      const copy = {...it};
      if(field==="drugId"){
        copy.drugId = val;
        const d = drugs.find(d=>d.id===val);
        copy.unitPrice = d?d.sellingPrice:0;
      } else {
        copy.quantity = Number(val);
      }
      return copy;
    }));
  };
  const addItem = () => setItems(old=>[...old,{ drugId:"",quantity:1,unitPrice:0 }]);
  const removeItem = (idx:number)=> setItems(old=>old.filter((_,i)=>i!==idx));

  const total = useMemo(()=>items.reduce((s,it)=>s+it.quantity*it.unitPrice,0),[items]);

  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault(); setError(null);
    if(!date) return setError("Chọn ngày");
    if(!prescriptionId && !customerId && !customerName) 
      return setError("Chọn khách hoặc nhập tên khách vãng lai");
    if(items.some(it=>!it.drugId||it.quantity<1)) 
      return setError("Kiểm tra lại thông tin thuốc");

    setLoading(true);
    try {
      const body: any = { date, status, items };
      if(prescriptionId) body.prescriptionId = prescriptionId;
      else if(customerId) body.customerId = customerId;
      else body.customerName = customerName.trim();

      const res = await fetch(
        isEdit ? `/api/invoices/${initialData!.id}` : "/api/invoices",
        {
          method: isEdit?"PUT":"POST",
          headers: { "Content-Type":"application/json" },
          body: JSON.stringify(body)
        }
      );
      const data = await res.json();
      if(!res.ok) throw new Error(data.error||"Lỗi server");
      router.push("/dashboard/invoices");
    } catch(e:any){
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded text-white space-y-4">
      <h2 className="text-2xl font-semibold">
        {isEdit?"Chỉnh sửa hóa đơn":"Tạo hóa đơn"}
      </h2>
      {error && <div className="bg-red-600 p-2 rounded">{error}</div>}

      {!isEdit && (
        <>
          <div>
            <label>Chọn đơn thuốc (nếu có)</label>
            <select
              value={prescriptionId}
              onChange={e=>{
                setPrescriptionId(e.currentTarget.value);
                setCustomerName("");
                setCustomerId("");
              }}
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="">-- Không dùng đơn --</option>
              {presList.map(p=>(
                <option key={p.id} value={p.id}>
                  {p.id} – {p.customer}
                </option>
              ))}
            </select>
          </div>

          {!prescriptionId && (
            <>
              <div>
                <label>Chọn khách có sẵn</label>
                <select
                  value={customerId}
                  onChange={e=>{
                    setCustomerId(e.currentTarget.value);
                    setCustomerName("");
                  }}
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">-- Khách mới --</option>
                  {customers.map(c=>(
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {!customerId && (
                <div>
                  <label>Tên khách vãng lai</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e=>setCustomerName(e.currentTarget.value)}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Nhập tên khách"
                    required
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      <div>
        <label>Ngày</label>
        <input
          type="date"
          value={date}
          onChange={e=>setDate(e.currentTarget.value)}
          className="w-full p-2 bg-gray-700 rounded"
          required
        />
      </div>

      <div>
        <label>Trạng thái</label>
        <select
          value={status}
          onChange={e=>setStatus(e.currentTarget.value as any)}
          className="w-full p-2 bg-gray-700 rounded"
        >
          <option value="UNPAID">Chưa thanh toán</option>
          <option value="PAID">Đã thanh toán</option>
        </select>
      </div>

      <div>
        <h3 className="font-medium">Thuốc</h3>
        {items.map((it, idx)=>(
          <div key={idx} className="flex space-x-2 mt-2">
            <select
              value={it.drugId}
              onChange={e=>updateItem(idx,"drugId",e.currentTarget.value)}
              className="flex-1 p-2 bg-gray-700 rounded"
              required
            >
              <option value="">-- Chọn thuốc --</option>
              {drugs.map(d=>(
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={it.quantity}
              onChange={e=>updateItem(idx,"quantity",e.currentTarget.value)}
              className="w-20 p-2 bg-gray-700 rounded"
              required
            />
            <input
              type="number"
              step="0.01"
              readOnly
              value={it.unitPrice}
              className="w-28 p-2 bg-gray-600 rounded cursor-not-allowed"
            />
            {items.length>1 && (
              <button
                type="button"
                onClick={()=>removeItem(idx)}
                className="text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 text-blue-400"
        >
          + Thêm dòng
        </button>
      </div>

      <div className="text-right">
        Tổng:&nbsp;
        <strong>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "USD",
          }).format(total)}
        </strong>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-green-600 rounded"
      >
        {loading
          ? isEdit ? "Đang lưu..." : "Đang tạo..."
          : isEdit ? "Lưu" : "Tạo"}
      </button>
    </form>
  );
}
