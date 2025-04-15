import React, { useState, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Button,
  Switch,
  FormControlLabel
} from '@mui/material';

const ProductForm = ({ product, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Other',
    imageUrl: '',
    isActive: true
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || 'Other',
        imageUrl: product.imageUrl || '',
        isActive: product.isActive !== false
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      alert('Please fill all required fields (marked with *)');
      return;
    }

    // Validate price and stock are numbers
    if (isNaN(formData.price) || isNaN(formData.stock)) {
      alert('Price and Stock must be valid numbers');
      return;
    }

    // Validate image URL if provided
    if (formData.imageUrl && !/^https?:\/\/.+\..+/.test(formData.imageUrl)) {
      alert('Please enter a valid image URL starting with http:// or https://');
      return;
    }

    // Convert numbers and submit
    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    });
  };

  const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Other'];

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Price *"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
            required
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Stock *"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Category *</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category *"
              required
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            helperText="Must be a valid URL (http:// or https://)"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                name="isActive"
                checked={formData.isActive}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label="Active"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button 
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
