const prisma = require("../config/prisma");

const getDashboard = async () => {

  const totalCompanies = await prisma.company.count();

  const totalEmployees = await prisma.employee.count();

  const totalTickets = await prisma.supportTicket.count();

  const expiredCompanies = await prisma.company.count({
    where: {
      expiryDate: {
        lt: new Date(),
      },
    },
  });

  // -----------------------------
  // Company Growth
  // -----------------------------

  const companies = await prisma.company.findMany({
    select: {
      createdAt: true,
    },
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const growth = {};

  months.forEach((m) => {
    growth[m] = 0;
  });

  companies.forEach((company) => {
    const month = new Date(company.createdAt).toLocaleString("en-US", {
      month: "short",
    });

    growth[month]++;
  });

  const companyGrowth = months.map((month) => ({
    month,
    companies: growth[month],
  }));

  // -----------------------------
  // Subscription Stats
  // -----------------------------

  const subscriptions = await prisma.company.groupBy({
    by: ["plan"],
    _count: {
      plan: true,
    },
  });

  const subscriptionStats = subscriptions.map((item) => ({
    plan: item.plan,
    count: item._count.plan,
  }));

  // -----------------------------
  // Latest Tickets
  // -----------------------------

const tickets = await prisma.supportTicket.findMany({
  orderBy: {
    createdAt: "desc",
  },

  take: 10,

  select: {
    id: true,
    title: true,
    priority: true,
    status: true,

    company: {
      select: {
        companyName: true,
      },
    },
  },
});

  return {
    totalCompanies,
    totalEmployees,
    totalTickets,
    expiredCompanies,
    companyGrowth,
    subscriptionStats,
tickets: tickets.map((ticket) => ({
  id: ticket.id,
  companyName: ticket.company?.companyName || "Unknown",
  subject: ticket.title,
  priority: ticket.priority,
  status: ticket.status,
})),
  };
};

module.exports = {
  getDashboard,
};