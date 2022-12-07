import React from "react";
import "./mainPage.css";

const MainPage = () => {
  return (
    <section className="mainPage">
      <h2>Наш новый роутер CRS518-16XS-2XQ</h2>
      <div className="mainPage__img">
        <div className="mainPage__img-info">
					<h3>О продукте</h3>
					<p>С 2 портами 100 Gigabit QSFP28 и 16 портами 25 Gigabit SFP28 это идеальное экономичное дополнение к любой корпоративной сети или центру обработки данных. </p>
				</div>
      </div>
			<div className="mainPage__feedback">
				<h2>Хотите задать вопрос или сделать заказ?</h2>
				<div className="mainPage__feedback-phone">
					<p>Свяжитесь с нами по номеру:</p>
					<p>+7(977)122-30-39</p>
					<span>(Telegram / WhatsApp)</span>
				</div>
				<div className="mainPage__feedback-soc">
					<img src="/vk.png" alt="vk" />
					<img src="/inst.png" alt="inst" />
					<img src="/tg.png" alt="tg" />
				</div>
			</div>
    </section>
  );
};

export default MainPage;
