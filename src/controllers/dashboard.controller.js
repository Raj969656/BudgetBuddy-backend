import Expense from "../models/expense.js";
import dayjs from "dayjs";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // All user expenses
    const expenses = await Expense.find({ userId }).sort("-createdAt");

    // Total spend this week
    const startOfWeek = dayjs().startOf("week");
    const thisWeekExpenses = expenses.filter(ex => dayjs(ex.createdAt).isAfter(startOfWeek));
    const total = thisWeekExpenses.reduce((sum, ex) => sum + ex.rs, 0);

    // Compare with last week
    const lastWeekStart = dayjs().subtract(1, "week").startOf("week");
    const lastWeekEnd = dayjs().subtract(1, "week").endOf("week");
    const lastWeekExpenses = expenses.filter(
      ex => dayjs(ex.createdAt).isAfter(lastWeekStart) && dayjs(ex.createdAt).isBefore(lastWeekEnd)
    );
    const lastWeekTotal = lastWeekExpenses.reduce((sum, ex) => sum + ex.rs, 0);
    const pct_change =
      lastWeekTotal > 0 ? (((total - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1) : 0;
    const trend = total >= lastWeekTotal ? "up" : "down";

    // Top Payment Method
    const paymentTotals = {};
    expenses.forEach(ex => {
      paymentTotals[ex.paymentMethod] = (paymentTotals[ex.paymentMethod] || 0) + ex.rs;
    });
    const topPayment = Object.entries(paymentTotals).sort((a, b) => b[1] - a[1])[0];
    const topPaymentMethodUsed = topPayment
      ? {
          name: topPayment[0],
          amount: topPayment[1],
          pct: ((topPayment[1] / total) * 100).toFixed(1),
        }
      : null;

    // Peak Day
    const dailyTotals = {};
    thisWeekExpenses.forEach(ex => {
      const d = dayjs(ex.createdAt).format("YYYY-MM-DD");
      dailyTotals[d] = (dailyTotals[d] || 0) + ex.rs;
    });
    const peakDayEntry = Object.entries(dailyTotals).sort((a, b) => b[1] - a[1])[0];
    const peakDay = peakDayEntry
      ? { date: peakDayEntry[0], amount: peakDayEntry[1] }
      : { date: null, amount: 0 };

    // Recent transactions (last 5)
    const recentTransactions = expenses.slice(0, 5);

    // Payment method breakdown for donut chart
    const paymentMethodBreakdown = Object.entries(paymentTotals).map(([name, amount]) => ({
      name,
      amount,
      pct: ((amount / total) * 100).toFixed(1),
    }));

    res.json({
      total,
      trend,
      pct_change,
      headline: "Your spending summary",
      currency: "INR",
      topPaymentMethodUsed,
      peakDay,
      recentTransactions,
      paymentMethodBreakdown,
      chart: {
        labels: Object.keys(dailyTotals),
        series: Object.values(dailyTotals),
      },
      severity: total > 5000 ? "warning" : "info",
      action: {
        label: "Manage Budget",
        tip: "Track your spending to stay within limits",
        url: "/budget",
      },
    });
  } catch (error) {
    console.error("Error in dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
