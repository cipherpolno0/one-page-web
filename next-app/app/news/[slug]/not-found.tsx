import Link from "next/link";

export default function NewsNotFound() {
  return (
    <section className="content-section" aria-labelledby="news-not-found-title">
      <div className="container news-not-found">
        <p className="eyebrow">ไม่พบข้อมูล</p>
        <h1 id="news-not-found-title">ไม่พบข่าวที่ต้องการ</h1>
        <p>ลิงก์ข่าวอาจไม่ถูกต้อง หรือข่าวรายการนี้ไม่มีอยู่ในข้อมูลตัวอย่าง</p>
        <Link className="button button-secondary" href="/news">กลับไปยังรายการข่าว</Link>
      </div>
    </section>
  );
}
