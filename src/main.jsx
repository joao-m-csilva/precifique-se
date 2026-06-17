import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calculator, Clock, DollarSign, Sparkles } from 'lucide-react';
import './styles.css';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function parseCurrency(value) {
  const normalized = String(value).replace(/\./g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function App() {
  const [form, setForm] = useState({
    monthlySalary: '8000',
    hoursPerDay: '6',
    workDaysPerMonth: '20',
    projectDays: '10',
    extraCosts: '300',
  });
  const [hasCalculated, setHasCalculated] = useState(false);

  const result = useMemo(() => {
    const monthlySalary = parseCurrency(form.monthlySalary);
    const hoursPerDay = Number(form.hoursPerDay) || 0;
    const workDaysPerMonth = Number(form.workDaysPerMonth) || 0;
    const projectDays = Number(form.projectDays) || 0;
    const extraCosts = parseCurrency(form.extraCosts);
    const monthlyHours = hoursPerDay * workDaysPerMonth;
    const hourlyRate = monthlyHours > 0 ? monthlySalary / monthlyHours : 0;
    const dailyRate = hourlyRate * hoursPerDay;
    const projectLabor = dailyRate * projectDays;
    const projectTotal = projectLabor + extraCosts;

    return {
      monthlyHours,
      hourlyRate,
      dailyRate,
      projectLabor,
      projectTotal,
      extraCosts,
    };
  }, [form]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setHasCalculated(true);
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">PrecifiqueSE</span>
          <h1>Transforme sua meta mensal em um preço justo por projeto.</h1>
          <p>
            Calcule seu valor por hora, por dia e o total do projeto considerando
            tempo de trabalho e custos extras, como ferramentas e assinaturas de IA.
          </p>
        </div>
      </section>

      <section className="calculator-layout" aria-label="Calculadora de precificacao">
        <form className="calculator-panel" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <Calculator aria-hidden="true" size={24} />
            <div>
              <h2>Dados do projeto</h2>
              <p>Informe sua meta e a carga prevista.</p>
            </div>
          </div>

          <div className="field-grid">
            <label>
              <span>Salário mensal desejado</span>
              <input
                inputMode="decimal"
                name="monthlySalary"
                onChange={updateField}
                placeholder="8000"
                type="text"
                value={form.monthlySalary}
              />
            </label>

            <label>
              <span>Horas trabalhadas por dia</span>
              <input
                min="1"
                name="hoursPerDay"
                onChange={updateField}
                step="0.5"
                type="number"
                value={form.hoursPerDay}
              />
            </label>

            <label>
              <span>Dias trabalhados no mês</span>
              <input
                min="1"
                name="workDaysPerMonth"
                onChange={updateField}
                step="1"
                type="number"
                value={form.workDaysPerMonth}
              />
            </label>

            <label>
              <span>Dias previstos para o projeto</span>
              <input
                min="1"
                name="projectDays"
                onChange={updateField}
                step="1"
                type="number"
                value={form.projectDays}
              />
            </label>

            <label className="field-wide">
              <span>Custos extras do projeto</span>
              <input
                inputMode="decimal"
                name="extraCosts"
                onChange={updateField}
                placeholder="300"
                type="text"
                value={form.extraCosts}
              />
            </label>
          </div>

          <button className="primary-button" type="submit">
            <DollarSign aria-hidden="true" size={20} />
            Calcular
          </button>
        </form>

        <aside className="results-panel" aria-live="polite">
          <div className="panel-heading">
            <Sparkles aria-hidden="true" size={24} />
            <div>
              <h2>Resultado</h2>
              <p>{hasCalculated ? 'Valores sugeridos para cobrança.' : 'Preencha e calcule.'}</p>
            </div>
          </div>

          <div className="result-list">
            <article>
              <span>Valor por hora</span>
              <strong>{hasCalculated ? formatCurrency(result.hourlyRate) : 'R$ 0,00'}</strong>
            </article>
            <article>
              <span>Valor por dia</span>
              <strong>{hasCalculated ? formatCurrency(result.dailyRate) : 'R$ 0,00'}</strong>
            </article>
            <article className="highlight">
              <span>Valor do projeto</span>
              <strong>{hasCalculated ? formatCurrency(result.projectTotal) : 'R$ 0,00'}</strong>
            </article>
          </div>

          <div className="summary-box">
            <Clock aria-hidden="true" size={20} />
            <p>
              Base de {result.monthlyHours || 0} horas mensais. O projeto soma{' '}
              {hasCalculated ? formatCurrency(result.projectLabor) : 'R$ 0,00'} em horas
              trabalhadas e {hasCalculated ? formatCurrency(result.extraCosts) : 'R$ 0,00'} em custos extras.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
