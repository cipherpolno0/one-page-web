"use client";

type DataLoadErrorProps = {
  reset: () => void;
  title: string;
};

export function DataLoadError({ reset, title }: DataLoadErrorProps) {
  return (
    <section className="content-section" aria-labelledby="data-load-error-title">
      <div className="container news-not-found">
        <p className="eyebrow">เกิดข้อผิดพลาดชั่วคราว</p>
        <h1 id="data-load-error-title">{title}</h1>
        <p>กรุณาลองใหม่อีกครั้งภายหลัง</p>
        <button className="button button-secondary" type="button" onClick={reset}>ลองใหม่</button>
      </div>
    </section>
  );
}
