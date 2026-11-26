"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  calculateBusinessMetrics,
  calculateSavings,
  DEFAULT_CONDITIONAL_SAVINGS,
  formatMoney,
  SUBSCRIPTION_PRICE_KOPECKS,
  type BenefitUsage,
  type ConditionalSavingsAssumptions,
} from "@/lib/finance";

const DEMO_USERS = calculateBusinessMetrics(12_480, 3_820);
const NAV_ITEMS = [
  { href: "#advantages", label: "Преимущества" },
  { href: "#partners", label: "Партнёры" },
  { href: "#calculator", label: "Калькулятор" },
  { href: "#account", label: "Кабинет" },
  { href: "#business", label: "Бизнесу" },
  { href: "#dashboard", label: "Админка" },
  { href: "#faq", label: "Вопросы" },
];
const INITIAL_USAGE: BenefitUsage = {
  shipments: 0,
  parcels: 0,
  additionalServices: 0,
};

function Button({
  children,
  href,
  onClick,
  secondary = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  secondary?: boolean;
}) {
  const className = `button${secondary ? " button-secondary" : ""}`;
  return href ? (
    <a className={className} href={href} onClick={onClick}>{children}</a>
  ) : (
    <button className={className} onClick={onClick} type="button">{children}</button>
  );
}

function Heading({ label, title, copy }: { label: string; title: string; copy: string }) {
  return <div className="section-heading"><span className="eyebrow">{label}</span><h2>{title}</h2><p>{copy}</p></div>;
}

function Money({ amount }: { amount: number }) {
  return <>{formatMoney(amount)}</>;
}

export default function PostcodeApp() {
  const [usage, setUsage] = useState(INITIAL_USAGE);
  const [assumptions, setAssumptions] = useState(DEFAULT_CONDITIONAL_SAVINGS);
  const [employees, setEmployees] = useState(12);
  const [subscription, setSubscription] = useState<"inactive" | "active" | "paused">("inactive");
  const [notice, setNotice] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const estimate = useMemo(
    () => calculateSavings(usage, assumptions),
    [usage, assumptions],
  );
  const teamUsage = useMemo(
    () => calculateSavings({
      shipments: usage.shipments * employees,
      parcels: usage.parcels * employees,
      additionalServices: usage.additionalServices * employees,
    }, assumptions),
    [employees, usage, assumptions],
  );
  const metrics = calculateBusinessMetrics(
    DEMO_USERS.registeredUsers + (subscription === "inactive" ? 0 : 1),
    DEMO_USERS.payingUsers + (subscription === "active" ? 1 : 0),
  );
  const projections = [1_000, 10_000, 100_000].map((users) => ({
    users,
    ...calculateBusinessMetrics(users, Math.round(users * DEMO_USERS.conversionRate)),
  }));
  const maxRevenue = Math.max(...projections.map((item) => item.monthlyRevenueKopecks));

  function updateUsage(key: keyof BenefitUsage, raw: string) {
    const value = Number(raw);
    if (Number.isFinite(value)) {
      setUsage((current) => ({ ...current, [key]: Math.min(99, Math.max(0, Math.floor(value))) }));
    }
  }

  function updateAssumption(key: keyof ConditionalSavingsAssumptions, raw: string) {
    const rubles = Number(raw);
    if (!Number.isFinite(rubles)) return;
    setAssumptions((current) => ({
      ...current,
      [key]: Math.min(100_000_000, Math.max(0, Math.round(rubles * 100))),
    }));
  }

  function changeSubscription(next: "inactive" | "active" | "paused", message: string) {
    setSubscription(next);
    setNotice(message);
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#home" onClick={() => setMobileMenuOpen(false)}><span className="brand-mark">П</span><span>почта<strong>премиум</strong></span></a>
          <button
            aria-controls="primary-navigation"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            {mobileMenuOpen ? "Закрыть" : "Меню"} <span aria-hidden="true">{mobileMenuOpen ? "−" : "+"}</span>
          </button>
          <nav
            aria-label="Основная навигация"
            className={mobileMenuOpen ? "primary-navigation is-open" : "primary-navigation"}
            id="primary-navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a href={item.href} key={item.href} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
          <Button href="#account" onClick={() => setMobileMenuOpen(false)} secondary>Личный кабинет</Button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><i /> Одна подписка — больше возможностей</span>
              <h1>Всё важное<br /><em>рядом с Почтой.</em></h1>
              <p>Почтовые услуги, цифровые сервисы и предложения партнёров в одной подписке — с понятными условиями каждой возможности.</p>
              <div className="hero-actions"><Button href="#account">Подключить за <Money amount={SUBSCRIPTION_PRICE_KOPECKS} /> <span>↗</span></Button><a className="plain-link" href="#calculator">Посчитать выгоду ↓</a></div>
              <small className="hero-reassurance">◈ Без обязательств. Отмена в любой момент.</small>
            </div>
            <div className="hero-art" aria-label="Демонстрационная карточка подписки">
              <div className="art-sun" /><div className="art-orbit" />
              <div className="stamp">ПОЧТА<br />РОССИИ</div>
              <div className="premium-card"><span>ПОЧТА ПРЕМИУМ</span><div className="card-spark">✳</div><h2>Почта и сервисы.<br />В одной подписке.</h2><div className="card-rule" /><div className="price-row"><small>демо-цена в месяц</small><b><Money amount={SUBSCRIPTION_PRICE_KOPECKS} /></b></div></div>
              <div className="float-card"><span className="float-check">✓</span><span><b>Экономия рядом</b><small>каждый день</small></span></div>
              <span className="art-star">✳</span>
            </div>
          </div>
          <div className="container hero-caption"><span>ПОЧТОВЫЕ УСЛУГИ · ЦИФРОВЫЕ СЕРВИСЫ · БОНУСЫ</span><i /><span>Условия каждого предложения прозрачны.</span></div>
        </section>

        <section className="section advantages" id="advantages">
          <div className="container">
            <Heading label="Возможности подписки" title="Почта и сервисы на каждый день" copy="Собрали повседневные почтовые услуги, цифровые предложения, комфорт в отделении и бонусы." />
            <div className="benefit-grid">
              <article className="benefit"><span className="benefit-icon blue">↗</span><small>ПОЧТОВЫЕ УСЛУГИ</small><h3>Отправлять проще</h3><p>Приоритетная сдача после онлайн-оформления, предложения на упаковку, вызов курьера и доставку — в рамках условий конкретной услуги.</p></article>
              <article className="benefit"><span className="benefit-icon sand">◉</span><small>ЦИФРОВЫЕ СЕРВИСЫ</small><h3>Больше читать и смотреть</h3><p>Яндекс Плюс, Литрес и специальные предложения на цифровые подписки. Доступность и условия могут различаться.</p></article>
              <article className="benefit"><span className="benefit-icon coral">⌂</span><small>КОМФОРТ</small><h3>Забота в отделении</h3><p>Электронная запись, помощь с Госуслугами, печать и сканирование в доступных отделениях и другие сервисы.</p></article>
              <article className="benefit"><span className="benefit-icon bonus">✳</span><small>ПОКУПКИ И БОНУСЫ</small><h3>Приятные дополнения</h3><p>Предложения на товары Почты России, бонусная программа, партнёрские скидки и купоны — по опубликованным правилам.</p></article>
            </div>
            <p className="disclaimer">Наличие услуги, размер выгоды и ограничения зависят от опубликованных условий и доступности в конкретном отделении.</p>
          </div>
        </section>

        <section className="section partners-section" id="partners">
          <div className="container">
            <Heading label="Экосистема предложений" title="Партнёры и сервисы" copy="Отделяем упомянутые в справочных материалах предложения от возможных направлений сотрудничества." />
            <div className="partner-group">
              <div className="partner-group-heading"><h3>Упомянуты в предоставленных материалах</h3><span>условия подключения уточняются</span></div>
              <div className="partner-grid">
                <article className="partner-card"><span className="partner-mark yandex-mark">Я</span><div><h4>Яндекс Плюс</h4><p>Упомянут в материалах как цифровой сервис. Состав и условия предложения необходимо подтвердить.</p></div><span className="partner-status">Условия уточняются</span></article>
                <article className="partner-card"><span className="partner-mark litres-mark">Л</span><div><h4>Литрес</h4><p>Упомянут в материалах как цифровой сервис. Не предполагаем бесплатный или безлимитный доступ.</p></div><span className="partner-status">Условия уточняются</span></article>
                <article className="partner-card"><span className="partner-mark post-mark">П</span><div><h4>Сервисы Почты России</h4><p>Онлайн-оформление, электронная запись и другие почтовые сервисы — с учётом фактической доступности.</p></div><span className="partner-status">Существующие сервисы</span></article>
              </div>
              <p className="partner-disclaimer">Упоминание сервиса в справке не означает, что он уже включён в подписку. Проверяйте условия предложения перед подключением.</p>
            </div>
            <div className="partner-group potential-group">
              <div className="partner-group-heading"><h3>Возможные направления сотрудничества</h3><span>не действующие соглашения</span></div>
              <p>VK · Сбер Прайм · ivi · Okko · Skillbox · Нетология · СберЗдоровье · другие сервисы</p>
              <p className="partner-disclaimer">Это идеи для будущих партнёрств. Не заявляем о действующих контрактах или доступных скидках.</p>
            </div>
          </div>
        </section>

        <section className="calculator-section section" id="calculator">
          <div className="container calculator-layout">
            <div className="calculator-intro"><span className="eyebrow light">Выгода в цифрах</span><h2>Пусть подписка<br />работает на вас.</h2><p>Укажите частоту использования. Для расчёта экономии добавьте собственные условные суммы преимуществ.</p><div className="calc-note">◈ <span>Подтверждённых денежных ставок нет. Значения для сценария по умолчанию нулевые.</span></div></div>
            <div className="calculator-card">
              <div className="calc-heading"><div><small>ВАША ОЦЕНКА</small><h3>Обычный месяц</h3></div><span className="demo-pill">✳ ДЕМО-КАЛЬКУЛЯТОР</span></div>
              <div className="calc-inputs">
                <label><span><i className="input-icon blue">↗</i>Отправляю посылки</span><span className="input-value"><input type="number" min="0" max="99" aria-label="Количество отправлений в месяц" value={usage.shipments} onChange={(event) => updateUsage("shipments", event.target.value)} /><small>в месяц</small></span></label>
                <label><span><i className="input-icon sand">▣</i>Получаю посылки</span><span className="input-value"><input type="number" min="0" max="99" aria-label="Количество получаемых посылок в месяц" value={usage.parcels} onChange={(event) => updateUsage("parcels", event.target.value)} /><small>в месяц</small></span></label>
                <label><span><i className="input-icon coral">✳</i>Дополнительные услуги</span><span className="input-value"><input type="number" min="0" max="99" aria-label="Частота дополнительных услуг в месяц" value={usage.additionalServices} onChange={(event) => updateUsage("additionalServices", event.target.value)} /><small>раз в месяц</small></span></label>
              </div>
              <details className="assumptions-panel">
                <summary>Добавить условные суммы выгоды</summary>
                <p>Подтверждённых денежных ставок в материалах нет. Эти значения задаёте вы для сценария; по умолчанию они нулевые.</p>
                <label>На одно отправление, ₽
                  <input aria-label="Условная выгода на одно отправление в рублях" min="0" max="1000000" step="0.01" type="number" value={(assumptions.shipmentKopecks / 100).toFixed(2)} onChange={(event) => updateAssumption("shipmentKopecks", event.target.value)} />
                </label>
                <label>На одну полученную посылку, ₽
                  <input aria-label="Условная выгода на одну полученную посылку в рублях" min="0" max="1000000" step="0.01" type="number" value={(assumptions.parcelKopecks / 100).toFixed(2)} onChange={(event) => updateAssumption("parcelKopecks", event.target.value)} />
                </label>
                <label>На одну дополнительную услугу, ₽
                  <input aria-label="Условная выгода на одну дополнительную услугу в рублях" min="0" max="1000000" step="0.01" type="number" value={(assumptions.additionalServiceKopecks / 100).toFixed(2)} onChange={(event) => updateAssumption("additionalServiceKopecks", event.target.value)} />
                </label>
              </details>
              <div className="estimate">
                <div className="confirmed-estimate"><span>Подтверждённая денежная экономия</span><b>нет опубликованных ставок</b></div>
                <div><span>Условная экономия по вашим ставкам</span><b><Money amount={estimate.grossSavingsKopecks} /></b></div>
                <div className="muted"><span>Подписка</span><span>− <Money amount={estimate.subscriptionCostKopecks} /></span></div>
                <div className="estimate-total"><span>Условный результат в месяц</span><strong className={estimate.netMonthlyKopecks >= 0 ? "positive" : "negative"}><Money amount={estimate.netMonthlyKopecks} /></strong></div>
                <div className="annual"><span>Условный результат за год</span><b className={estimate.netAnnualKopecks >= 0 ? "positive" : "negative"}><Money amount={estimate.netAnnualKopecks} /></b></div>
              </div>
              <div className="break-even"><span>◷ &nbsp;Условная точка безубыточности</span><b>{estimate.breakEvenActions === null ? "укажите ставки сценария" : `${estimate.breakEvenActions} действий в месяц`}</b></div>
              <small className="calc-disclaimer">Сценарная оценка не является реальным тарифом, скидкой или обещанием экономии.</small>
            </div>
          </div>
        </section>

        <section className="section account-section" id="account">
          <div className="container">
            <Heading label="Всё под контролем" title="Ваш личный кабинет" copy="Управляйте подпиской и смотрите историю преимуществ в одном месте." />
            <div className="account-grid">
              <article className="account-card">
                <div className="profile"><div className="avatar">АК</div><div><small>ДЕМО-ПРОФИЛЬ</small><h3>Анна Кузнецова</h3><span>anna.k@example.ru</span></div></div>
                <hr />
                <div className="plan-row"><span className="plan-icon">✳</span><span><b>Почта Премиум</b><small><Money amount={SUBSCRIPTION_PRICE_KOPECKS} /> / месяц</small></span><span className={`status status-${subscription}`}><i />{subscription === "active" ? "Активна" : subscription === "paused" ? "Пауза" : "Не подключена"}</span></div>
                <div className="account-estimate"><span>Условный результат за месяц</span><b className={estimate.netMonthlyKopecks >= 0 ? "positive" : "negative"}><Money amount={estimate.netMonthlyKopecks} /></b><small>по введённым вами ставкам · не фактическая экономия</small></div>
                <div className="available-benefits">
                  <h4>{subscription === "active" ? "Предложения подписки" : "Возможности после подключения"}</h4>
                  <p><b>Почта:</b> онлайн-оформление, приоритетная сдача и предложения на услуги — по опубликованным условиям.</p>
                  <p><b>Цифровые сервисы:</b> Яндекс Плюс и Литрес упомянуты в справке; доступность в подписке не подтверждена.</p>
                  <p><b>Комфорт и бонусы:</b> электронная запись, сервисы отделений и купоны — при наличии и на условиях предложения.</p>
                </div>
                {notice && <p className="account-notice" role="status">{notice}</p>}
                {subscription === "inactive" ? <Button onClick={() => changeSubscription("active", "Подписка подключена в деморежиме — списания не было.")}>Подключить подписку <span>↗</span></Button> : <div className="manage-buttons">{subscription === "active" ? <Button secondary onClick={() => changeSubscription("paused", "Подписка приостановлена. Платежи не выполняются.")}>Ⅱ &nbsp;Приостановить</Button> : <Button onClick={() => changeSubscription("active", "Подписка возобновлена в деморежиме.")}>Возобновить <span>↗</span></Button>}<button className="cancel" onClick={() => changeSubscription("inactive", "Подписка отменена. Её можно подключить снова.")}>Отменить</button></div>}
                <small className="payment-note">◈ Безопасный деморежим — реальные платежи не подключены.</small>
              </article>
              <article className="account-card history-card"><div className="history-heading">              <div><small>ВАША АКТИВНОСТЬ</small><h3>История преимуществ</h3></div><span>Демо-история</span></div>
                <div className="history-list">
                  <div><i className="history-icon blue">↗</i><span><b>Онлайн-оформление отправления</b><small>Демо-событие · условия сдачи зависят от услуги</small></span><strong>Условие</strong></div>
                  <div><i className="history-icon sand">▣</i><span><b>Электронная запись</b><small>Демо-событие · доступность зависит от отделения</small></span><strong>Сервис</strong></div>
                  <div><i className="history-icon coral">✳</i><span><b>Партнёрское предложение</b><small>Демо-событие · условия уточняются</small></span><strong>Купон</strong></div>
                </div><small className="history-disclaimer">История демонстрационная; суммы скидок не указаны, поскольку тарифы не подтверждены.</small>
              </article>
            </div>
          </div>
        </section>

        <section className="section business-section" id="business">
          <div className="container business-grid">
            <div>
              <span className="eyebrow">Почта для продавцов и компаний</span>
              <h2>Почтовые сервисы<br />для ваших задач.</h2>
              <p>Варианты для компаний и продавцов, которые отправляют заказы или хотят упростить работу сотрудников с услугами Почты России.</p>
              <div className="business-tiers" id="business-tariffs">
                <article><span>Для продавцов</span><b>Отправка заказов и курьерские услуги</b><small>Состав, цена и доступность преимуществ уточняются.</small></article>
                <article><span>Для компаний</span><b>Почтовые и цифровые сервисы для команды</b><small>Корпоративные условия и лимиты требуют согласования.</small></article>
              </div>
              <a className="business-link" href="#business-tariffs">Посмотреть варианты для бизнеса ↓</a>
            </div>
            <article className="business-card">
              <div className="business-title"><span>◉</span><span><b>Оценка для команды</b><small>Сценарий, не корпоративный тариф</small></span></div>
              <div className="business-price"><b>Цена обсуждается</b><span>тариф и лимиты не опубликованы</span></div>
              <label htmlFor="employees">Количество сотрудников</label>
              <div className="employee-control">
                <button aria-label="Уменьшить количество сотрудников" onClick={() => setEmployees((count) => Math.max(1, count - 1))}>−</button>
                <input id="employees" aria-label="Количество сотрудников" type="number" min="1" max="500" value={employees} onChange={(event) => setEmployees(Math.min(500, Math.max(1, Number(event.target.value) || 1)))} />
                <button aria-label="Увеличить количество сотрудников" onClick={() => setEmployees((count) => Math.min(500, count + 1))}>+</button>
                <small>человек</small>
              </div>
              <p className="business-input-note">Частота услуг на сотрудника берётся из введённых выше значений калькулятора.</p>
              <div className="limits">
                <div><span>Отправлений по сценарию</span><b>{usage.shipments * employees} / месяц</b></div>
                <div><span>Получений по сценарию</span><b>{usage.parcels * employees} / месяц</b></div>
                <div><span>Доп. услуг по сценарию</span><b>{usage.additionalServices * employees} / месяц</b></div>
              </div>
              <div className="team-savings"><span>Условная экономия до тарифа</span><b><Money amount={teamUsage.grossSavingsKopecks} /> <small>/ месяц</small></b><small>Рассчитано только по вашим суммам сценария.</small></div>
              <div className="business-total">Чистая выгода <b>не рассчитывается без B2B-цены</b></div>
            </article>
          </div>
        </section>

        <section className="section admin-section" id="dashboard"><div className="container">
          <div className="admin-heading"><div><span className="eyebrow">Цифры за сценой</span><h2>Панель администратора</h2><p>Демонстрационные метрики проекта и сценарии роста.</p></div><span className="demo-label"><i /> ДЕМО-ДАННЫЕ</span></div>
          <div className="metrics-grid">
            <article><small>Зарегистрированные</small><b>{metrics.registeredUsers.toLocaleString("ru-RU")}</b><span>пользователей</span></article>
            <article><small>Платящие подписчики</small><b>{metrics.payingUsers.toLocaleString("ru-RU")}</b><span>из зарегистрированных</span></article>
            <article><small>Выручка за месяц</small><b>{(metrics.monthlyRevenueKopecks / 100).toLocaleString("ru-RU")} ₽</b><span>при демо-цене <Money amount={SUBSCRIPTION_PRICE_KOPECKS} /></span></article>
            <article><small>Доход на регистрацию</small><b><Money amount={metrics.revenuePerRegisteredUserKopecks} /></b><span>средний доход / пользователь</span></article>
          </div>
          <div className="forecast"><div className="forecast-head"><div><small>СЦЕНАРИИ РОСТА</small><h3>Как может расти выручка</h3></div><span>Демо-цена <Money amount={SUBSCRIPTION_PRICE_KOPECKS} /> / месяц</span></div>
            <div className="chart" role="img" aria-label="Прогноз выручки по трём сценариям">
              {projections.map((projection) => <div className="chart-column" key={projection.users}><div className="bar-area"><div className="bar" style={{ height: `${Math.max(8, projection.monthlyRevenueKopecks / maxRevenue * 100)}%` }}><span>{(projection.monthlyRevenueKopecks / 100).toLocaleString("ru-RU")} ₽</span></div></div><b>{projection.users.toLocaleString("ru-RU")}</b><small>пользователей</small><span>{projection.payingUsers.toLocaleString("ru-RU")} платящих</span></div>)}
            </div>
            <p className="forecast-note">Условный прогноз при сохранении демо-конверсии ({(DEMO_USERS.conversionRate * 100).toFixed(1)}%). Не является финансовым прогнозом.</p>
          </div>
        </div></section>

        <section className="section faq-section" id="faq"><div className="container faq-grid"><div><span className="eyebrow">Хороший вопрос</span><h2>Всё просто.<br />Вот почему.</h2><p>Проверьте категории предложений и ограничения до подключения.</p><a href="#partners">К предложениям партнёров ↗</a></div><div className="faq-list">
          <details open><summary>Что такое «Почта Премиум»?<b>+</b></summary><p>Концепция единой подписки на преимущества Почты России и предложения цифровых и других партнёрских сервисов. Фактический состав будет зависеть от опубликованных условий.</p></details>
          <details><summary>Подписка стоит <Money amount={SUBSCRIPTION_PRICE_KOPECKS} />?<b>+</b></summary><p><Money amount={SUBSCRIPTION_PRICE_KOPECKS} /> в месяц — базовая демонстрационная цена этой версии продукта. Это не подтверждённая оферта Почты России; условия тарифа требуют согласования.</p></details>
          <details><summary>Партнёрские сервисы уже подключены?<b>+</b></summary><p>Яндекс Плюс и Литрес перечислены в предоставленной справке; фактическое включение в подписку и условия не подтверждены. Остальные перечисленные сервисы — возможные направления, не действующие соглашения.</p></details>
          <details><summary>Как считается экономия?<b>+</b></summary><p>Подтверждённые денежные ставки не указаны. Можно ввести собственные условные значения для сценария; результат не является тарифом, скидкой или обещанием экономии.</p></details>
          <details><summary>Можно ли отменить демо-подписку?<b>+</b></summary><p>Да. В личном кабинете можно подключить, приостановить, отменить и возобновить симулированную подписку. Реальные списания не выполняются.</p></details>
        </div></div></section>
        <section className="closing"><div className="container closing-inner"><div><small>ПУСТЬ БУДЕТ ПРОЩЕ.</small><h2>Почта рядом.<br /><em>И выгода тоже.</em></h2></div><div><Button href="#account">Попробовать за <Money amount={SUBSCRIPTION_PRICE_KOPECKS} /> ↗</Button><small>Демо-подписка. Без реального списания.</small></div><span className="closing-mark">П</span></div></section>
      </main>
      <footer className="footer"><div className="container"><a className="brand" href="#home"><span className="brand-mark">П</span><span>почта<strong>премиум</strong></span></a><p>Демонстрационный проект для хакатона. Не является официальным предложением Почты России.</p><a href="#home">Наверх ↑</a></div></footer>
    </>
  );
}
