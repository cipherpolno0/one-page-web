export function ContactSection() {
  return (
    <section className="content-section contact-section" id="contact" aria-labelledby="contact-title">
      <div className="container contact-layout">
        <div>
          <p className="eyebrow">ยินดีให้บริการ</p>
          <h2 id="contact-title">ติดต่อเรา</h2>
          <p className="contact-intro">
            ข้อมูลติดต่อด้านข้างเป็นข้อมูลจำลองสำหรับหน้าเว็บไซต์ตัวอย่าง หากต้องการสอบถามข้อมูลเพิ่มเติม
            กรุณาติดต่อผ่านช่องทางที่หน่วยงานกำหนดในวันและเวลาราชการ
          </p>
        </div>
        <address className="contact-details">
          <div><span className="contact-details__label">โทรศัพท์ (ตัวอย่าง)</span><a href="tel:020000000">02-000-0000</a></div>
          <div><span className="contact-details__label">อีเมล (ตัวอย่าง)</span><a href="mailto:contact@example.org">contact@example.org</a></div>
          <div><span className="contact-details__label">เวลาทำการ</span><span>วันจันทร์–ศุกร์ 08.30–16.30 น.</span></div>
          <div><span className="contact-details__label">ศูนย์บริการ</span><span>ศูนย์บริการข้อมูลตัวอย่าง</span></div>
        </address>
      </div>
    </section>
  );
}
