/**
 * 🤝 ПАРТНЕРСКИЙ КАБИНЕТ (X24 Pro Style)
 * 
 * Философия: Простота, удобство, минимализм
 * Вдохновение: refstat.ex24.pro (Exchange24 Pro)
 * 
 * Начинаем с обмена валюты (currency-exchange partner)
 * Потом расширим на всех партнеров
 * 
 * Дизайн: iOS 26 + Telegram Wallet + Perplexity принципы
 */

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  Clock,
  FileSpreadsheet,
  BarChart3
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: number;
  commission: number;
  status: 'completed' | 'pending';
}

interface MonthlyStats {
  month: string;
  deals: number;
  commission: number;
}

const PartnerCabinet = () => {
  const { partnerId } = useParams<{ partnerId?: string }>();
  
  // TODO: Заменить на реальные данные из API
  const [stats] = useState({
    commission: '1.00%',
    totalDeals: 65,
    balance: 3799,
    currency: 'THB'
  });

  const [monthlyStats] = useState<MonthlyStats[]>([
    { month: '2025/10', deals: 3, commission: 254 },
    { month: '2025/09', deals: 5, commission: 303 },
    { month: '2025/08', deals: 8, commission: 608 },
    { month: '2025/07', deals: 23, commission: 1526 },
    { month: '2025/06', deals: 20, commission: 895 },
    { month: '2025/05', deals: 6, commission: 212 }
  ]);

  const [transactions] = useState<Transaction[]>([
    { id: '#971644', date: '26.10.2025 19:03', from: 'RUB Bank', to: 'THB', amount: 27375, commission: 273.75, status: 'completed' },
    { id: '#962669', date: '22.10.2025 12:33', from: 'RUB Bank', to: 'THB', amount: 15000, commission: 150, status: 'completed' },
    { id: '#948613', date: '15.10.2025 15:12', from: 'RUB Bank', to: 'THB', amount: 27262, commission: 272.62, status: 'completed' },
    { id: '#893946', date: '16.09.2025 22:56', from: 'RUB Bank', to: 'THB', amount: 43059, commission: 430.59, status: 'completed' },
    { id: '#878939', date: '08.09.2025 18:58', from: 'RUB Bank', to: 'THB', amount: 2000, commission: 20, status: 'completed' }
  ]);

  const handleExportXLSX = () => {
    // TODO: Реализовать экспорт в xlsx
    alert('Экспорт в XLSX будет реализован в ближайшее время');
  };

  if (!partnerId || partnerId !== 'currency-exchange') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Партнер не найден</h1>
          <p className="text-gray-600 mb-6">Доступен только кабинет для обмена валюты</p>
          <Link to="/partners" className="text-[#007AFF] hover:underline">
            Вернуться к партнерам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header - iOS 26 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <Link 
            to="/partners" 
            className="inline-flex items-center gap-2 text-[#007AFF] hover:text-[#0051D5] transition-colors mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад</span>
          </Link>
          
          <h1 className="text-xl font-bold text-gray-900">Статистика по источнику Phuketda</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Key Statistics - 3 Cards (X24 Pro Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Комиссия */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#007AFF]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Комиссия</p>
                <p className="text-2xl font-bold text-gray-900">{stats.commission}</p>
              </div>
            </div>
          </div>

          {/* Всего сделок */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Всего сделок</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeals}</p>
              </div>
            </div>
          </div>

          {/* Баланс */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Баланс</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.balance.toLocaleString()} {stats.currency}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Successful Deals - Monthly Breakdown (X24 Pro Style) */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 mb-6">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Успешные сделки</h2>
            <button
              onClick={handleExportXLSX}
              className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] text-white rounded-xl hover:bg-[#0051D5] transition-colors text-sm font-medium"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Скачать xlsx
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Месяц</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Количество сделок</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Комиссия {stats.currency}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {monthlyStats.map((stat, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{stat.month}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{stat.deals}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#007AFF] text-right">
                      {stat.commission.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Completed Deals - Transactions List (X24 Pro Style) */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Все завершенные сделки</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Сделка</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Дата</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Откуда</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Куда</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">К оплате</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{transaction.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{transaction.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{transaction.from}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{transaction.to}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                      {transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Block - Ready for Partnership */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#007AFF] flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Готовы к сотрудничеству с любым партнером
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Мы открыты для партнерства! Если вы предоставляете услуги на Пхукете и готовы делиться комиссией, свяжитесь с нами.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                  Прозрачная отчетность
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                  Экспорт данных
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                  Автоматические выплаты
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerCabinet;



