# Release Notes

## v1.0.0 — 26 กันยายน 2569

- สถานะ: พร้อมเผยแพร่
- Production URL: https://cipherpolno0.github.io/one-page-web/
- Commit ที่เป็นฐานของเว็บไซต์ที่ตรวจ: b59bc462df7ce24dc2adf03d8ca6754bb9240e29 (`first commit`, branch `main`)
- วันที่ทดสอบ production: 26 กันยายน 2569

### ผล smoke test

- เปิดหน้าแรกผ่าน HTTPS และโหลด HTML, CSS, JavaScript ได้
- เมนูข่าวนำทางไปยัง `#news` ได้
- ค้นหา “เปิดรับข้อเสนอ” เหลือผลลัพธ์ 1 รายการ
- ไม่พบ console error ที่มีแหล่งมาจาก `cipherpolno0.github.io`
- เอกสาร PDF ระบุชัดว่าเป็นข้อมูลตัวอย่างและยังไม่มีไฟล์จริง

### Known issues

- ปุ่มเปิด/ดาวน์โหลด PDF อยู่ในสถานะไม่พร้อมใช้งานโดยตั้งใจ จนกว่าจะเพิ่มไฟล์จริง
- ยังไม่มี GitHub Release/tag อย่างเป็นทางการสำหรับรุ่นนี้

### แนวทาง rollback

หาก release ถัดไปมีปัญหา ให้สร้าง commit `git revert <commit-ที่มีปัญหา>` บน `main` และ deploy ใหม่จาก branch เดิม หลีกเลี่ยง force push หรือการเขียนประวัติร่วมกันใหม่
