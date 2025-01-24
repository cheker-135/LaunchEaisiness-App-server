import { Service } from "../models/service.model.js";
import { User } from "../models/user.model.js";

export const addService = async (req, res) => {
  const {
    company_name,
    manager,
    certificate_number,
    siege_social,
    registre_commerce,
    matricule_fiscale,
    forme_juridique,
    capitale_social,
    participation_etrangere,
    participation_locale,
    num_cnss,
    tel,
    fax,
    email,
    validated,
  } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (user.role === "USER") {
      return res.status(400).json({ message: "Don't have permission" });
    }
    const image =
      req.files["image"] && req.files["image"][0]
        ? {
            path: `http://localhost:5000/uploads/${req.files["image"][0].filename}`,
            date: new Date(),
          }
        : null;

    const files = req.files["files"].map((file) => ({
      path: `http://localhost:5000/uploads/${file.filename}`,
      date: new Date(),
    }));

    const service = new Service({
      company_name,
      manager,
      certificate_number,
      siege_social,
      registre_commerce,
      matricule_fiscale,
      forme_juridique,
      capitale_social,
      participation_etrangere,
      participation_locale,
      num_cnss,
      tel,
      fax,
      email,
      validated,

      image: image,
      files: files,
      userId: req.userId,
    });

    const savedService = await service.save();

    res.status(201).send(savedService);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).send(services);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getServiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateService = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.userId);
    if (user.role == "USER") {
      res.status(400).json({ message: "don't have permission" });
    }
    const service = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.userId);
    if (user.role == "USER") {
      res.status(400).json({ message: "don't have permission" });
    }
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }
    res.status(200).send({ message: "Service deleted successfully", service });
  } catch (error) {
    res.status(500).send(error);
  }
};
