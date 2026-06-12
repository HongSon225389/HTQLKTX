const LoaiPhong = require("../models/LoaiPhong");

// ======================================
// GET ALL
// GET /api/loai-phong
// ======================================
exports.getAllLoaiPhong = async (req, res) => {
  try {
    const loaiPhong = await LoaiPhong.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: loaiPhong.length,
      data: loaiPhong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET BY ID
// GET /api/loai-phong/:id
// ======================================
exports.getLoaiPhongById = async (req, res) => {
  try {
    const loaiPhong = await LoaiPhong.findById(req.params.id);

    if (!loaiPhong) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy loại phòng",
      });
    }

    res.status(200).json({
      success: true,
      data: loaiPhong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// CREATE
// POST /api/loai-phong
// ======================================
exports.createLoaiPhong = async (req, res) => {
  try {
    const { maLoaiPhong, tenLoaiPhong, sucChua, donGia } = req.body;

    const existed = await LoaiPhong.findOne({
      maLoaiPhong,
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Mã loại phòng đã tồn tại",
      });
    }

    const loaiPhong = await LoaiPhong.create({
      maLoaiPhong,
      tenLoaiPhong,
      sucChua,
      donGia,
    });

    res.status(201).json({
      success: true,
      message: "Thêm loại phòng thành công",
      data: loaiPhong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// UPDATE
// PUT /api/loai-phong/:id
// ======================================
exports.updateLoaiPhong = async (req, res) => {
  try {
    if (req.body.maLoaiPhong) {
      const existed = await LoaiPhong.findOne({
        maLoaiPhong: req.body.maLoaiPhong,
        _id: { $ne: req.params.id },
      });

      if (existed) {
        return res.status(400).json({
          success: false,
          message: "Mã loại phòng này đã được sử dụng",
        });
      }
    }
    const loaiPhong = await LoaiPhong.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!loaiPhong) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy loại phòng",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      data: loaiPhong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// INACTIVE
// PUT /api/loai-phong/:id/deactivate
// ======================================
exports.deactivateLoaiPhong = async (req, res) => {
  try {
    const loaiPhong = await LoaiPhong.findByIdAndUpdate(
      req.params.id,
      {
        trangThai: "INACTIVE",
      },
      {
        new: true,
      },
    );

    if (!loaiPhong) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy loại phòng",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ngừng sử dụng loại phòng thành công",
      data: loaiPhong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// ACTIVE
// PUT /api/loai-phong/:id/activate
// ======================================
exports.activateLoaiPhong = async (req, res) => {
  try {
    const loaiPhong = await LoaiPhong.findByIdAndUpdate(
      req.params.id,
      {
        trangThai: "ACTIVE",
      },
      {
        new: true,
      },
    );

    if (!loaiPhong) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy loại phòng",
      });
    }

    res.status(200).json({
      success: true,
      message: "Kích hoạt loại phòng thành công",
      data: loaiPhong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
