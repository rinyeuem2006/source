import { productHtml } from "./manager/product.js";
import { initProductPage } from "./manager/product_list.js";
import { orders as initialOrders } from "./data/orders.js";
import { importHtml, initImportPage } from "./manager/imports.js";
import { dashboardHtml, initDashboardPage } from "./manager/dashboard.js";
import "../database.js";
import { reportHtml, initReportPage } from "./manager/report.js";

//////////////////////////////////
function navigateSPA(pageId) {
  window.navigateSPA = navigateSPA;
  // 1. Ẩn TẤT CẢ các trang
  const pages = document.querySelectorAll("#content .page");
  pages.forEach((page) => {
    page.style.display = "none";
    page.classList.remove("active"); // Thêm: xóa class active
  });
  // 2. Hiển thị trang được yêu cầu
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.style.display = "block";
    targetPage.classList.add("active"); // Thêm: thêm class active
  } else {
    console.error("Lỗi: Không tìm thấy trang với ID: ", pageId);
  }
  // 3. (Nâng cao) Cập nhật trạng thái 'active' trên menu
  const menuButtons = document.querySelectorAll("#sidebar button");
  menuButtons.forEach((button) => {
    button.classList.remove("active");
  });
  // Thêm 'active' cho nút vừa được nhấp
  // ID của nút là 'menu-dashboard', 'menu-products', ...
  const activeButton = document.getElementById(`menu-${pageId}`);
  if (activeButton) {
    activeButton.classList.add("active");
  }
}

// Xử lý trang mặc định khi tải
document.addEventListener("DOMContentLoaded", function () {
  //Tìm các nút
  const toggleBtn = document.getElementById("toggle-sidebar-btn");
  const closeBtn = document.getElementById("close-btn");

  const wrapper = document.getElementById('admin-wrapper');
  if (toggleBtn && closeBtn && wrapper) {
    //Gán sự kiện cho nút hamburger (toggle)
    toggleBtn.onclick = function() {
      wrapper.classList.toggle('sidebar-hidden');
    }
    
    // Gán sự kiện cho nút X (luôn đóng)
    closeBtn.onclick = function() {
      wrapper.classList.add('sidebar-hidden');
    }
  }

  //Tải và khởi tạo trang Dashboard
  const dashboardPageDiv = document.getElementById("dashboard");
  if (dashboardPageDiv) {
    dashboardPageDiv.innerHTML = dashboardHtml;
    initDashboardPage();
  } else {
    console.error("Lỗi: Không thể khởi tạo <div id='dashboard'>!");
  }

  //Tải và khởi tạo trang Products
  const productsPageDiv = document.getElementById("products");
    if (productsPageDiv) {
      productsPageDiv.innerHTML = productHtml;
      initProductPage(); 
    } else {
      console.error("Lỗi: Không thể khởi tạo <div id='products'> để nạp trang!");
    }

    //Tải và khởi tạo trang Imports
    const importPageDiv = document.getElementById("imports");
    if (importPageDiv) {
      importPageDiv.innerHTML = importHtml;
      initImportPage();
    } else {
      console.error("Lỗi: Không thể khởi tạo <div id='imports'> để nạp trang!");
    }

  // BƯỚC 4: THÊM KHỞI TẠO TRANG REPORT
  const reportPageDiv = document.getElementById("reports");
  if (reportPageDiv) {
    reportPageDiv.innerHTML = reportHtml;
    initReportPage(); // Chạy hàm init để vẽ biểu đồ
  } else {
    console.error("Lỗi: Không thể khởi tạo <div id='reports'> để nạp trang!");
  }


  //Khởi tạo các hàm và sự kiện của trang "Dashboard" (Users/Orders)
  initOrdersPage(); // Phải chạy cái này trước để nó gán sự kiện
  
  //Điều hướng đến trang mặc định
  const defaultActiveButton = document.querySelector("#sidebar button.active");
  if (defaultActiveButton) {
    // Lấy ID trang từ ID của nút (ví dụ: 'menu-products' -> 'products')
    const defaultPageId = defaultActiveButton.id.replace("menu-", "");
    navigateSPA(defaultPageId);
  } else {
    // Nếu không có nút active, mặc định là dashboard
    navigateSPA("dashboard");
  }
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      // Hỏi xác nhận trước khi đăng xuất
      if (confirm('Bạn có chắc muốn đăng xuất không?')) {
        
        //Xóa thông tin admin đã đăng nhập
        localStorage.removeItem('currentAdmin');
        
        // Chuyển hướng người dùng về trang đăng nhập
        window.location.href = 'login.html';
      }
    }
  }
});


function initOrdersPage(){
// My js

  function migrateOrderData() {
    const getData = key => JSON.parse(localStorage.getItem(key));
    const setData = (key, val) => localStorage.setItem(key, JSON.stringify(val));
      
    let orders = getData("orders");
    if (!orders || orders.length === 0) return; // Không có gì để làm

    // Kiểm tra xem đơn hàng đầu tiên đã có 'date' chưa
    if (typeof orders[0].date === 'undefined') {
      console.warn("Phát hiện dữ liệu đơn hàng cũ, đang nâng cấp...");
      orders.forEach(o => {
        if (!o.date) {
          // Tận dụng ID (là Date.now()) để tạo ngày
          o.date = new Date(o.id).toISOString(); 
        }
      });
      setData("orders", orders);
      console.log("Nâng cấp dữ liệu đơn hàng thành công!");
      }
    }
    migrateOrderData(); // Chạy hàm
    const sidebar1 = document.getElementById("sidebar1");
    const content1 = document.getElementById("content1");
    const menuButtons = document.querySelectorAll(".button_linear"); 
    const popup = document.getElementById("popup");
    const popupFields = document.getElementById("popupFields");
    const popupTitle = document.getElementById("popupTitle");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn1 = document.getElementById("cancelBtn1");
    
    // POPUP DÙNg CHUNg
    function showPopup(title, fieldsHTML, onSave) { 
      popupTitle.textContent = title;
      popupFields.innerHTML = fieldsHTML;
      popup.classList.add("active"); 
      saveBtn.onclick = () => {
        const inputs = popupFields.querySelectorAll("input, select");
        const values = {};
        inputs.forEach(i => values[i.name] = i.value); // name: value
        onSave(values);
      };
      cancelBtn1.onclick = () => popup.classList.remove("active");
    }
    const getData = key => JSON.parse(localStorage.getItem(key));
    const setData = (key, val) => localStorage.setItem(key, JSON.stringify(val));
    
    // Logic nạp 'orders'
    const currentOrders = getData("orders");
    if (!currentOrders || currentOrders.length === 0) {
      setData("orders", initialOrders);
    }


    // Phần moving cho scrollbar và content  
    async function animateSidebarChange(newHTML, newContentHTML) {
      sidebar1.classList.add("hide");
      content1.classList.add("fade");
      await new Promise(res => setTimeout(res, 400)); // thoi gian cho transition( await: cho toi khi promise xong)
      sidebar1.innerHTML = newHTML;
      content1.innerHTML = newContentHTML;
      sidebar1.classList.remove("hide");
      content1.classList.remove("fade");
    }

    
    menuButtons.forEach(btn => btn.addEventListener("click", () => {
        // Thêm class active cho nút được click
        menuButtons.forEach(b => b.classList.remove('active-mode'));
        btn.classList.add('active-mode');
        
        // Gọi loadMode
        loadMode(btn.dataset.mode);
    }));

// các loại mode (phần này hơi dài do có tới 3 mode) nhưng cấu trúc tương tự nhau 
    function loadMode(mode) {
      
      // ===================================
      // MODE: QL NGƯỜI DÙNG (Code của bạn)
      // ===================================
      if (mode === "users") {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        animateSidebarChange(`
          <button class="list_scrollbar" data-act="add">➕ Thêm người dùng</button>
          <button class="list_scrollbar" data-act="edit">✏️ Sửa người dùng</button>
          <button class="list_scrollbar" data-act="del">🗑️ Xóa người dùng</button>
        `, `
          <h2>Quản lý người dùng</h2>
          <style>
          </style>
          <table class="table_content">
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Mật khẩu</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>edit</th>
            </tr>
            ${users.map(u => `
              <tr>
              <td>${u.id}</td>
              <td>${u.name}</td>
              <td>${u.email}</td>
              <td>${u.password}</td>
              <td>${u.role}</td>
              <td>${u.state}
                ${u.state==="Off"?`<i class="fa-solid fa-lock" style="color:red"></i>`:`<i class="fa-solid fa-unlock" style="color:green"></i>`}
              </td>
              <td><button class="edit-btn" id="${u.id}">Sua</button>
              <button class="delete-btn" id="${u.id}">Xoa</button>
              </td></tr>`).join("")}
          </table> 
        `).then(() => {
          document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click",()=>{
              const id = btn.id;
              const u = users.find(u => u.id == id);
              showPopup("Sửa người dùng", `
                <input name="name" value="${u.name}">
                <input name="email" value="${u.email}">
                <input name="password" value="${u.password}">
                <select name="role">
                  <option ${u.role==="Khách hàng"?"selected":""}>Khách hàng</option>
                  <option ${u.role==="Nhân viên"?"selected":""}>Nhân viên</option>
                </select>
                <select name="state">
                  <option ${u.state==="On"?"selected":""}> On </option>
                  <option ${u.state==="Off"?"selected":""}> Off </option>
                </select>
                `, vals => {
                  //Ghi đè
                  Object.assign(u, vals); 
                  setData("users", users);
                  loadMode("users");
                  popup.classList.remove("active");
                });  
              });
           });
           
          document.querySelectorAll(".delete-btn").forEach(btn=>{
           btn.addEventListener("click", ()=>{
             const id=btn.id;
             const userIndex = users.findIndex(u => u.id == id); 
              if (userIndex === -1) return alert("Lỗi: Không tìm thấy người dùng!");
             
             showPopup(`Bạn có chắc muốn xóa ${users[userIndex].name}?`,``
              ,vals =>{              
                users.splice(userIndex, 1); 
                setData("users",users);
                loadMode("users");
                popup.classList.remove("active");
             });           
            }             
            );          
           }   
          );
          document.querySelectorAll(".list_scrollbar").forEach(btn => { 
             btn.addEventListener("click", e => {
              const act = e.target.dataset.act; 
              if (act === "add") {
                showPopup("Thêm người dùng", `
                  <input name="name" placeholder="Tên người dùng">
                  <input name="email" placeholder="Email">
                  <input name="password" placeholder="Mật khẩu" type="password">
                  <select name="role">
                    <option>Khách hàng</option>
                    <option>Nhân viên</option>
                  </select>
                  <select name="state">
                    <option> On </option>
                    <option> Off </option>
                  </select>
                `, vals => {
                  users.push({ id: Date.now(), ...vals });
                  setData("users", users);
                  loadMode("users"); 
                  popup.classList.remove("active");
                });
              }
              if (act === "del") {
                const id = prompt("Nhập ID người dùng muốn xóa:"); 
                const idx = users.findIndex(u => u.id == id);
                if (idx >= 0) {
                  users.splice(idx, 1); 
                  setData("users", users);
                  loadMode("users");
                } else alert("Không tìm thấy ID!");
              }
              if (act === "edit") {
                const id = prompt("Nhập ID người dùng cần sửa:");
                const u = users.find(u => u.id == id);
                if (!u) return alert("Không tìm thấy!");
                showPopup("Sửa người dùng", `
                  <input name="name" value="${u.name}">
                  <input name="email" value="${u.email}">
                  <select name="role">
                    <option ${u.role==="Khách hàng"?"selected":""}>Khách hàng</option>
                    <option ${u.role==="Nhân viên"?"selected":""}>Nhân viên</option>
                  </select>
                  <select name="state">
                    <option ${u.state==="On"?"selected":""}> On </option>
                    <option ${u.state==="Off"?"selected":""}> Off </option>
                  </select>
                `, vals => {
                  Object.assign(u, vals); 
                  setData("users", users);
                  loadMode("users");
                  popup.classList.remove("active");
                });
              }
              if (act === "lock") {
                showPopup("Lock users",`...`, vals => {
                  setData("users",users);
                  loadMode("users");
                  popup.classList.remove("active");
                });
              }
            });
          });
        });
      }
      

      else if (mode === "products") {
        console.log("Điều hướng đến trang Products chính...");
        navigateSPA('products');
      }

      else if (mode === "orders") {
        
        // Lấy dữ liệu orders tổng
        let allOrders = getData("orders") || [];
        // Lấy dữ liệu products để xử lý logic kho
        let allProducts = getData("products") || []; 
        
        // --- NÂNG CẤP DỮ LIỆU (QUAN TRỌNG) ---
        // Thêm productId vào các đơn hàng cũ dựa trên tên
        if (allOrders.length > 0 && typeof allOrders[0].productId === 'undefined') {
            console.warn("Đang nâng cấp đơn hàng cũ (thêm productId)...");
            allOrders.forEach(o => {
                if (!o.productId) {
                    const foundProduct = allProducts.find(p => p.name === o.product);
                    if (foundProduct) {
                        o.productId = foundProduct.id;
                    } else {
                        o.productId = null; // Không tìm thấy
                    }
                }
            });
            setData("orders", allOrders); // Lưu lại
            console.log("Nâng cấp đơn hàng hoàn tất.");
        }

        const formatCurrency = (val) => (val || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

        // --- HÀM 1: Render Bảng ---
        function renderOrderTable(ordersToRender) {
          const tableContainer = document.getElementById("order-table-container");
          if (!tableContainer) return;

          if (ordersToRender.length === 0) {
            tableContainer.innerHTML = "<p style='text-align:center; color: #999; padding-top: 20px;'>Không tìm thấy đơn hàng nào.</p>";
            return;
          }

          tableContainer.innerHTML = `
            <table class="table_content">
              <tr>
                <th>ID Đơn hàng</th>
                <th>Ngày đặt</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
              ${ordersToRender.map(o => `
                <tr class="order-row" data-order-id="${o.id}" style="cursor: pointer;">
                  <td>#${o.id}</td>
                  <td>${formatDate(o.date)}</td>
                  <td>${o.user}</td>
                  <td>${formatCurrency(o.total)}</td>
                  <td><strong style="color: ${getStatusColor(o.status)}">${o.status}</strong></td>
                </tr>
              `).join("")}
            </table>
          `;
        }

        // --- HÀM 2: Lọc và Render ---
        function applyFiltersAndRender() {
          // Lấy lại dữ liệu mới nhất
          allOrders = getData("orders") || [];

          const dateFrom = document.getElementById("date-from").value;
          const dateTo = document.getElementById("date-to").value;
          const status = document.getElementById("status-filter").value;

          const start = dateFrom ? new Date(dateFrom).getTime() : 0;
          // Thêm 1 ngày (mili giây) để bao gồm cả ngày kết thúc
          const end = dateTo ? new Date(dateTo).getTime() + 86400000 : Infinity; 

          const filtered = allOrders.filter(o => {
            const orderDate = new Date(o.date).getTime();
            
            const statusMatch = (status === "all") || (o.status === status);
            const dateMatch = (orderDate >= start) && (orderDate <= end);
            
            return statusMatch && dateMatch;
          });
          
          // Sắp xếp mới nhất lên đầu
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          renderOrderTable(filtered);
        }
        
        // --- HÀM 3: Lấy màu trạng thái ---
        function getStatusColor(status) {
          switch (status) {
            case "Mới đặt": return "#007bff"; // Xanh dương
            case "Đang xử lý": return "#fd7e14"; // Cam
            case "Đã giao": return "#28a745"; // Xanh lá
            case "Đã hủy": return "#dc3545"; // Đỏ
            default: return "#6c757d"; // Xám
          }
        }

        // --- HTML MỚI CHO CONTENT ---
        animateSidebarChange(`
          <button class="list_scrollbar" data-act="add">➕ Thêm đơn hàng</button>
          <button class="list_scrollbar" data-act="del">🗑️ Xóa đơn hàng</button>
          <p style="padding: 10px; color: #777; font-size: 0.9em;">Click vào một đơn hàng trong bảng để xem chi tiết và cập nhật trạng thái.</p>
        `, `
          <h2>Quản lý đơn hàng</h2>
          
          <div class="order-filters" style="display: flex; gap: 15px; align-items: center; padding: 15px; background: #2a2a2a; border-radius: 8px; margin-bottom: 20px;">
            <div style="flex-grow: 1;">
              <label style="color: #ccc; font-size: 0.9em;">Từ ngày:</label>
              <input type="date" id="date-from" style="width: 100%; padding: 8px; border-radius: 4px; border: none; background: #3a3a3a; color: white;">
            </div>
            <div style="flex-grow: 1;">
              <label style="color: #ccc; font-size: 0.9em;">Đến ngày:</label>
              <input type="date" id="date-to" style="width: 100%; padding: 8px; border-radius: 4px; border: none; background: #3a3a3a; color: white;">
            </div>
            <div style="flex-grow: 1;">
              <label style="color: #ccc; font-size: 0.9em;">Trạng thái:</label>
              <select id="status-filter" style="width: 100%; padding: 8px; border-radius: 4px; border: none; background: #3a3a3a; color: white;">
                <option value="all">Tất cả</option>
                <option value="Mới đặt">Mới đặt</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đã giao">Đã giao</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
            <button id="filter-btn" class="button_linear" style="align-self: flex-end; padding: 8px 15px;">Lọc</button>
          </div>

          <div id="order-table-container">
            </div>
        `).then(() => {

          // --- GÁN SỰ KIỆN CHO CÁC NÚT ---

          // 1. Nút lọc
          document.getElementById("filter-btn").onclick = applyFiltersAndRender;
          // Tự động lọc khi đổi status
          document.getElementById("status-filter").onchange = applyFiltersAndRender;


          // 2. Click vào hàng của bảng (để SỬA)
          document.getElementById("order-table-container").addEventListener("click", (e) => {
            const row = e.target.closest(".order-row");
            if (!row) return; // Click không trúng hàng
            
            const orderId = row.dataset.orderId;
            // SỬA: Lấy lại allOrders từ getData để đảm bảo dữ liệu mới nhất
            allOrders = getData("orders") || []; 
            const order = allOrders.find(o => o.id == orderId); 
            if (!order) return alert("Không tìm thấy đơn hàng!");
            
            const oldStatus = order.status; // Lưu lại trạng thái cũ

            // SỬA: Xử lý đơn hàng nhiều sản phẩm
            const productNames = order.products ? order.products.map(p => `${p.name} (SL: ${p.quantity})`).join('<br>') : "(Không có sản phẩm)";
            
            // Mở popup để sửa trạng thái
            showPopup(`Chi tiết đơn hàng #${order.id}`, `
              <p style="color: #ccc;">Khách hàng: <strong>${order.user}</strong></p>
              <div style="color: #ccc; border: 1px solid #555; padding: 5px; margin-top: 5px; border-radius: 4px; max-height: 150px; overflow-y: auto;">
                <strong>Sản phẩm:</strong>
                ${order.products.map(p => 
                    `<p style="margin: 2px 0 2px 10px;">- ${p.name} (SL: ${p.quantity})</p>`
                ).join('')}
              </div>
              <p style="color: #ccc; margin-top: 5px;">Tổng tiền: <strong>${formatCurrency(order.total)}</strong></p>
              <hr style="border-color: #444; margin: 10px 0;">
              <label style="color: #fff; display: block; margin-top: 10px;">Cập nhật trạng thái:</label>
              <select name="status" style="width: 100%; padding: 8px; border-radius: 4px; border: none; background: #3a3a3a; color: white;">
                <option value="Mới đặt" ${oldStatus === "Mới đặt" ? "selected" : ""}>Mới đặt</option>
                <option value="Đang xử lý" ${oldStatus === "Đang xử lý" ? "selected" : ""}>Đang xử lý</option>
                <option value="Đã giao" ${oldStatus === "Đã giao" ? "selected" : ""}>Đã giao</option>
                <option value="Đã hủy" ${oldStatus === "Đã hủy" ? "selected" : ""}>Đã hủy</option>
              </select>
            `, (vals) => {
              const newStatus = vals.status;
              
              // === SỬA LỖI 1: PHẢI CẬP NHẬT TRẠNG THÁI NGAY ===
              order.status = newStatus;
              
              // XỬ LÝ KHO
              allProducts = getData("products") || []; // Lấy kho mới nhất
              
              // === SỬA LOGIC: CHỈ "ĐÃ GIAO" MỚI LÀ "SOLD" ===
              const oldIsSold = (oldStatus === "Đã giao");
              const newIsSold = (newStatus === "Đã giao");

              let canProcess = true;
              let stockUpdates = []; // Lưu các thay đổi

              // KỊCH BẢN 1: Từ (Bất kỳ) -> (Đã giao) => TRỪ KHO
              if (!oldIsSold && newIsSold) {
                  order.products.forEach(p => {
                      const productInStock = allProducts.find(item => item.id == p.productId); // Dùng ==
                      if (!productInStock) {
                          alert(`Lỗi: Không tìm thấy sản phẩm "${p.name}" (ID: ${p.productId}) trong kho.`);
                          canProcess = false;
                      } else if (productInStock.quantity < p.quantity) {
                          alert(`Không thể xử lý! Tồn kho của "${p.name}" (còn ${productInStock.quantity}) không đủ cho số lượng ${p.quantity}.`);
                          canProcess = false;
                      } else {
                          stockUpdates.push({ product: productInStock, change: -p.quantity });
                      }
                  });

                  if (canProcess) {
                      stockUpdates.forEach(update => {
                          update.product.quantity += update.change;
                      });
                      alert(`Đã trừ kho cho ${stockUpdates.length} sản phẩm.`);
                      setData("products", allProducts);
                      channel.postMessage({ type: "products_updated" });
                  }
              } 
              // KỊCH BẢN 2: Từ (Đã giao) -> (Trạng thái khác) => HOÀN KHO
              else if (oldIsSold && !newIsSold) {
                  order.products.forEach(p => {
                       const productInStock = allProducts.find(item => item.id == p.productId); // Dùng ==
                       if(productInStock) {
                          productInStock.quantity += p.quantity;
                          stockUpdates.push(productInStock);
                       }
                  });
                  if (stockUpdates.length > 0) {
                    alert(`Đã hoàn trả kho cho ${stockUpdates.length} sản phẩm.`);
                    setData("products", allProducts);
                    channel.postMessage({ type: "products_updated" });
                  }
              }

              // SỬA LỖI 1: Chỉ return nếu KHÔNG THỂ XỬ LÝ
              if (!canProcess) return; 
              
              // === SỬA LỖI 1: BA DÒNG NÀY BỊ THIẾU ===
              setData("orders", allOrders);
              applyFiltersAndRender();
              popup.classList.remove("active");
            });
          });
          
          // 3. Nút Thêm / Xóa (Sidebar)
          document.querySelectorAll(".list_scrollbar").forEach(btn => {
            btn.addEventListener("click", e => {
              const act = e.target.dataset.act;
              
              if (act === "add") {
                // Tải lại danh sách sản phẩm mới nhất
                allProducts = getData("products") || [];
                const productOptions = allProducts
                    .filter(p => p.quantity > 0) // Chỉ bán hàng còn tồn kho
                    .map(p => `<option value="${p.id}">${p.name} (Tồn: ${p.quantity})</option>`).join('');
                    
                // === SỬA LỖI 2: ĐỒNG BỘ ĐỊNH DẠNG ĐƠN HÀNG ===
                showPopup("Thêm đơn hàng", `
                  <input name="user" placeholder="Tên khách hàng">
                  
                  <label style="color: #ccc; display:block; margin-top:10px;">Sản phẩm:</label>
                  <select name="productId" style="width: 100%; padding: 8px; border-radius: 4px; border: none; background: #3a3a3a; color: white;">
                    ${productOptions}
                  </select>
                  
                  <label style="color: #ccc; display:block; margin-top:10px;">Số lượng bán:</label>
                  <input name="quantity" placeholder="Số lượng" type="number" min="1">
                  
                  <label style="color: #ccc; display:block; margin-top:10px;">Trạng thái:</label>
                  <select name="status">
                      <option value="Mới đặt">Mới đặt</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đã giao">Đã giao</option>
                  </select>
                `, vals => {
                  allProducts = getData("products") || []; // Lấy lại lần nữa
                  // Dùng == vì vals.productId là chuỗi
                  const product = allProducts.find( 
                    (p) => p.id == vals.productId
                  );
                  const quantity = parseInt(vals.quantity);

                  if (!product) return alert("Sản phẩm không hợp lệ!");
                  if (!quantity || quantity <= 0) return alert("Số lượng phải lớn hơn 0!");
                  
                  if (product.quantity < quantity) {
                    return alert(`Không đủ hàng! Tồn kho của "${product.name}" chỉ còn ${product.quantity}.`);
                  }
                  
                  // CHỈ TRỪ KHO KHI "ĐÃ GIAO"
                  if (vals.status === "Đã giao") {
                    product.quantity -= quantity;
                    setData("products", allProducts); // Lưu kho
                    channel.postMessage({ type: 'products_updated' });
                  }
                  
                  // TẠO ĐƠN HÀNG Ở ĐỊNH DẠNG CHUẨN (giống user.js)
                  const newOrder = { 
                    id: Date.now(), 
                    date: new Date().toISOString(),
                    user: vals.user,
                    status: vals.status,
                    payMethod: "Admin",
                    total: product.price * quantity, 
                    address: { name: vals.user },
                    products: [ // Phải là một mảng
                      {
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.img,
                        quantity: quantity
                      }
                    ]
                  };
                  
                  allOrders = getData("orders") || []; // Lấy lại DS đơn hàng
                  allOrders.push(newOrder);
      
                  setData("orders", allOrders); // Lưu đơn hàng
                  
                  applyFiltersAndRender(); 
                  popup.classList.remove("active");
                });
                // === KẾT THÚC SỬA LỖI 2 ===
              }
              
              if (act === "del") {
                const id = prompt("Nhập ID đơn hàng muốn xóa (Hành động này KHÔNG hoàn kho):");
                if (!id) return;
                
                allOrders = getData("orders") || []; // Lấy lại
                const idx = allOrders.findIndex(o => o.id == id);
                if (idx >= 0) {
                  if (confirm(`Bạn có chắc muốn xóa vĩnh viễn đơn hàng #${id}?`)) {
                      allOrders.splice(idx, 1);
                      setData("orders", allOrders);
                      applyFiltersAndRender();
                  }
                } else alert("Không tìm thấy ID!");
              } 
            });
          });

          // 4. Render lần đầu
          applyFiltersAndRender();
        });
      }
    } // Đóng hàm loadMode

  const channel = new BroadcastChannel('data_update');
  channel.onmessage = (event) => {
        // Chỉ quan tâm đến sự kiện 'products_updated'
        if (event.data.type !== 'products_updated') return;

        console.log("Phát hiện cập nhật sản phẩm... Tự động làm mới các tab liên quan.");

        const dashboardPage = document.getElementById('dashboard');
        const productsPage = document.getElementById('products');
        const ordersPage = document.getElementById('orders'); // Div QL Users/Orders
        const importsPage = document.getElementById('imports');
        const reportsPage = document.getElementById('reports'); // Div Báo cáo

        // 1. Nếu Dashboard (XNT/Tồn kho) đang mở, tải lại nó
        if (dashboardPage && dashboardPage.style.display === 'block') {
            console.log("Admin auto-refreshing: Dashboard (Stock Alerts/XNT)");
            dashboardPage.innerHTML = dashboardHtml; // Nạp lại HTML
            initDashboardPage(); // Chạy lại logic
        }
        
        // 2. Nếu trang Products (QL Sản Phẩm) đang mở, tải lại nó
        if (productsPage && productsPage.style.display === 'block') {
            console.log("Admin auto-refreshing: Product List Page");
            productsPage.innerHTML = productHtml;
            initProductPage(); 
        }

        // 3. Nếu trang Imports (QL Nhập Hàng) đang mở, tải lại nó
        if (importsPage && importsPage.style.display === 'block') {
          console.log("Admin auto-refreshing: Imports Page");
          importsPage.innerHTML = importHtml;
          initImportPage();
        }
        
        // 4. Nếu trang Orders (QL Users/Orders) đang mở, tải lại mode hiện tại
        if (ordersPage && ordersPage.style.display === 'block') {
             console.log("Admin auto-refreshing: Users/Orders Page");
             const activeModeBtn = ordersPage.querySelector('.button_linear.active-mode');
             if (activeModeBtn) {
                const currentMode = activeModeBtn.dataset.mode;
                // Chỉ reload nếu đang ở mode 'orders' (vì nó hiển thị tên SP/tồn kho)
                if (currentMode === 'orders') {
                  console.log("Đang tải lại mode 'orders'...");
                  loadMode(currentMode); 
                }
             }
        }

        // 5. BƯỚC 4: NẾU TRANG REPORTS ĐANG MỞ, TẢI LẠI NÓ
        if (reportsPage && reportsPage.style.display === 'block') {
            console.log("Admin auto-refreshing: Reports Page");
            reportsPage.innerHTML = reportHtml;
            initReportPage();
        }
      };
}
