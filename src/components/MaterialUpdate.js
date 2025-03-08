import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import supabase from "./supabaseClient";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";

const MaterialUpdate = () => {
  const [formData, setFormData] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    plantation: "",
    noOfLiters: "",
    materialName: "",
    quantityPerLiter: "",
    totalQuantity: "",
    cost: "",
  });

  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [costPerUnit, setCostPerUnit] = useState(0);
  const [availableQuantity, setAvailableQuantity] = useState(0);

  // Fetch materials from Supabase
  useEffect(() => {
    const fetchMaterials = async () => {
      const { data, error } = await supabase
        .from("stock")
        .select("material_name, cost_per_unit, available_quantity");
      if (error) {
        console.error("Error fetching materials:", error);
      } else {
        setMaterials(data);
      }
    };

    fetchMaterials();
  }, []);

  const handleMaterialChange = (event, newValue) => {
    setSelectedMaterial(newValue);
    if (newValue) {
      setFormData({ ...formData, materialName: newValue.material_name });

      // Update cost_per_unit and available_quantity based on selection
      setCostPerUnit(newValue.cost_per_unit || 0);
      setAvailableQuantity(newValue.available_quantity || 0);

      // Recalculate cost
      const totalQuantity = parseFloat(formData.totalQuantity) || 0;
      const cost = ((newValue.cost_per_unit || 0) / 1000) * totalQuantity;
      setFormData((prev) => ({ ...prev, cost: cost.toFixed(2) }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Auto-calculate Total Quantity Used
    if (name === "noOfLiters" || name === "quantityPerLiter") {
      const liters = parseInt(updatedData.noOfLiters, 10) || 0;
      const quantity = parseInt(updatedData.quantityPerLiter, 10) || 0;
      updatedData.totalQuantity = liters * quantity;
    }

    // Auto-calculate Cost using cost_per_unit
    if (name === "noOfLiters" || name === "quantityPerLiter") {
      const totalQuantity = updatedData.totalQuantity || 0;
      const cost = (costPerUnit / 1000) * totalQuantity;
      updatedData.cost = cost.toFixed(2);
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.materialName || !selectedMaterial) {
      alert("Please select a material.");
      return;
    }

    const usedQuantity = (formData.totalQuantity || 0) / 1000;
    const newAvailableQuantity = availableQuantity - usedQuantity;

    if (newAvailableQuantity < 0) {
      alert("Not enough available quantity!");
      return;
    }

    try {
      // Update available_quantity in Supabase
      const { error } = await supabase
        .from("stock")
        .update({ available_quantity: newAvailableQuantity })
        .eq("material_name", formData.materialName);

      if (error) {
        console.error("Error updating available quantity:", error);
        alert("Error updating available quantity.");
      } else {
        alert("Available quantity updated successfully!");
      }

      const {history_err} = await supabase
        .from("history")
        .insert([ // Insert new row
          {
            material_name: formData.materialName,
            quantity_used: formData.totalQuantity,
            last_updated: new Date().toISOString().split("T")[0] // Sets today's date
          }
        ]);

      if (history_err) {
        console.error("Error while updating history: ", history_err);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper" }}>
        <Typography variant="h5" gutterBottom align="center">
          Material Update Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            variant="outlined"
            margin="normal"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Plantation"
            name="plantation"
            variant="outlined"
            margin="normal"
            value={formData.plantation}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="No of Liters Used"
            name="noOfLiters"
            type="number"
            variant="outlined"
            margin="normal"
            value={formData.noOfLiters}
            onChange={handleChange}
            required
          />
          {/* Material Name Autocomplete Dropdown */}
          <Autocomplete
            options={materials}
            getOptionLabel={(option) => option.material_name}
            onChange={handleMaterialChange}
            renderInput={(params) => <TextField {...params} label="Material Name" variant="outlined" margin="normal" required />}
          />
          <TextField
            fullWidth
            label="Quantity Used per Liter"
            name="quantityPerLiter"
            type="number"
            variant="outlined"
            margin="normal"
            value={formData.quantityPerLiter}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Total Quantity Used"
            name="totalQuantity"
            type="number"
            variant="outlined"
            margin="normal"
            value={formData.totalQuantity}
            disabled
          />
          <TextField
            fullWidth
            label="Cost"
            name="cost"
            type="number"
            variant="outlined"
            margin="normal"
            value={formData.cost}
            disabled
          />
          <TextField
            fullWidth
            label="Available Quantity"
            name="availableQuantity"
            type="number"
            variant="outlined"
            margin="normal"
            value={availableQuantity.toFixed(2)}
            disabled
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default MaterialUpdate;
