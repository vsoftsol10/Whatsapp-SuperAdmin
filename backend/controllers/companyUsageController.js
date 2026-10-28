const companyUsageService = require("../services/companyUsageService");

// GET /api/company-usage
const getCompanyUsageList = async (req, res) => {
  try {
    const data = await companyUsageService.getUsageList();

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("GET COMPANY USAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load company usage",
    });
  }
};

// GET /api/company-usage/:id   (id = Company.id, the number)
const getCompanyUsageDetail = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid company id",
      });
    }

    const data = await companyUsageService.getUsageDetail(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("GET COMPANY USAGE DETAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load company usage",
    });
  }
};

module.exports = {
  getCompanyUsageList,
  getCompanyUsageDetail,
};