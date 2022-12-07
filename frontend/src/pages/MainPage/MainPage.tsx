import React from "react";
import "./mainPage.css";

const MainPage = () => {
  return (
    <div className="mainPage">
      <h2>Наш новый роутер CRS518-16XS-2XQ</h2>
      <div className="mainPage__img">
        <div className="mainPage__img-info">
					<h3>О продукте</h3>
					<p>С 2 портами 100 Gigabit QSFP28 и 16 портами 25 Gigabit SFP28 это идеальное экономичное дополнение к любой корпоративной сети или центру обработки данных. </p>
				</div>
      </div>
			<div className="mainPage__feedback">
				<h2>Хотите задать вопрос или сделать заказ?</h2>
			</div>
    </div>
  );
};

export default MainPage;
