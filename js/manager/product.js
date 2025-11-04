

export const productHtml = `
  <div class="container"></div>
  <div class="product-actions">
    <input type="text" id="search-product" placeholder="🔍 Tìm sản phẩm..." style="padding:10px;width:300px;border-radius:6px;border:1px solid #ccc;"/>
    <button class="add-product-btn" id="add-product-btn">➕ Thêm sản phẩm</button>
  </div>
  <div class="product-management">
    <div class="product-header" style="grid-template-columns: 0.5fr 1fr 2fr 1fr 1fr 1fr 1fr 1fr;">
      <div>#ID</div>
      <div>Ảnh</div>
      <div>Tên sản phẩm</div>
      <div>Thương hiệu</div>
      <div>Status</div>
      <div>Giá Vốn</div>
      <div>% Lợi Nhuận</div>
      <div>Giá Bán</div>
    </div>
  </div>
  <div class="product-list" id="productList"></div>
  <div class="overlay" id="overlay">
    <form class="form-box" id="productForm">
        <h3 id="formTitle">Thêm sản phẩm</h3>
        <input type="text" id="productId" placeholder="Mã sản phẩm" required>
        <input type="text" id="productName" placeholder="Tên sản phẩm" required>
        <input type="text" id="productBrand" placeholder="Thương hiệu" required>
        <input type="number" id="productProfitMargin" placeholder="% Lợi nhuận (ví dụ: 20)" required step="0.1">
        
        <input type="number" id="productLowStock" placeholder="Mức cảnh báo tồn kho (ví dụ: 10)" required>
        
        <select id="productStatus" required style="width: 100%; padding: 10px; margin: 8px 0; border-radius: 6px; border: 1px solid #ccc;">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
        </select>
        <input type="file" id="productImage" accept="image/*">
        <div class="form-buttons">
            <button type="submit" class="button">Lưu</button>
            <button type="button" class="button cancel-btn" id="cancelBtn">Hủy</button>
        </div>
    </form>
  </div>
`;