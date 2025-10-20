# Dự án Đánh giá nguy cơ đột quỵ

## Mục lục:

# 1. Giới thiệu chung

**🚨 Đột quỵ** (hay tai biến mạch máu não) là một tình trạng y tế khẩn cấp, là một trong những nguyên nhân hàng đầu gây tử vong và tàn phế lâu dài trên toàn cầu. Tuy nhiên, phần lớn các ca đột quỵ đều có thể được phòng ngừa nếu các yếu tố nguy cơ được phát hiện và kiểm soát sớm.

🎯 Với mục tiêu "phòng bệnh hơn chữa bệnh", dự án **StrokePredict** được xây dựng như một công cụ hỗ trợ cộng đồng. Đây là một ứng dụng web cho phép người dùng:

- **Tìm hiểu thông tin:** Cung cấp kiến thức tổng quan về đột quỵ, các nguyên nhân và phương pháp phòng ngừa.
- **Đánh giá nguy cơ:** Người dùng nhập vào các chỉ số sức khỏe (như tuổi, giới tính, huyết áp) và thói quen sinh hoạt (hút thuốc, làm việc).
- **Nhận kết quả:** Hệ thống sẽ trả về đánh giá về mức độ nguy cơ đột quỵ (Thấp, Trung bình, Cao) để người dùng tham khảo.

Cốt lõi của dự án là một **Hệ chuyên gia (Rule-Based AI)** được xây dựng bằng Python, sử dụng một bộ luật (rules) được định nghĩa sẵn (trong `rules.json`) để phân tích dữ liệu đầu vào và đưa ra dự đoán.

**📚 Đây là dự án bài tập lớn cho môn học *Cơ sở Trí tuệ Nhân tạo* (lớp 2526I_AIT2004#_5).** 

# 2. Link demo online

### 🌐 Bạn có thể trải nghiệm sản phẩm trực tiếp tại trang web của dự án:

- **Link Demo:** [https://saun-b.github.io/StronkePredict/#intro1](https://saun-b.github.io/StronkePredict/#intro1)

### Hướng dẫn sử dụng web 👇:

1. Truy cập vào link demo trên.
2. Trang web sẽ giới thiệu tổng quan về dự án và bệnh lý.
3. Kéo xuống phần **"Dự đoán nguy cơ đột quỵ"**.
4. Điền các thông tin cá nhân và chỉ số sức khỏe vào biểu mẫu.
5. Nhấn nút **"Dự đoán"**.
6. Hệ thống sẽ trả về kết quả đánh giá nguy cơ (Thấp, Trung bình, Cao) ngay bên dưới.

# 3. Kiến trúc & Thuật toán

## 3.1. **Cấu trúc thư mục**

**📂 Dự án được tổ chức với cấu trúc thư mục rõ ràng, tách biệt Backend (logic AI) và Frontend (giao diện web):**

```markdown
StrokePredict/
├── Backend/
│   ├── rules.json     # (File JSON chứa bộ luật chuyên gia)
│   └── [rules.py](http://rules.py/)       # (File Python xử lý logic đọc và áp dụng luật)
│
├── docs/              # (Thư mục chứa Frontend cho GitHub Pages)
│   ├── static/
│   │   ├── style.css  # (File CSS cho giao diện)
│   │   ├── script.js  # (File JS để xử lý sự kiện và gọi API)
│   │   ├── logo.png
│   │   └── brain.png
│   └── index.html     # (Trang web chính)
│
├── [app.py](http://app.py/)             # (File server Backend - API Flask)
├── requirements.txt   # (Các thư viện Python cần thiết cho Backend)
├── Procfile           # (Cấu hình deploy cho Render)
├── .gitignore         # (File bỏ qua các file không cần thiết)
└── [README.md](http://readme.md/)          # (File tài liệu bạn đang đọc)
```

## 3.2. Kiến trúc hệ thống

🌐 Hệ thống được thiết kế theo mô hình **Client–Server** (Frontend–Backend) tách biệt. Điều này có nghĩa là phần giao diện người dùng và phần xử lý logic hoạt động độc lập, nhưng kết nối với nhau qua Internet thông qua API.

### 3.2.1. Frontend (Client)

- **Thành phần:** gồm các file `index.html`, `style.css`, `script.js`, đặt trong thư mục `/docs`.
- **Cách triển khai:** sử dụng GitHub Pages để đưa trang web lên Internet.
- **Nhiệm vụ:**
    - Hiển thị giao diện (UI) cho người dùng.
    - Thu thập dữ liệu đầu vào (form: tuổi, cân nặng, bệnh lý…).
    - Gửi dữ liệu này đến Backend qua API.
    - Nhận phản hồi từ Backend và hiển thị kết quả.
- **Đặc điểm:** là ứng dụng **tĩnh** (static), không có khả năng tính toán AI, chỉ đóng vai trò hiển thị và giao tiếp.

### 3.2.2. Backend (Server)

- **Thành phần:** `app.py` (Flask server), `rules.py`, `rules.json`.
- **Cách triển khai:** chạy trên Render – nền tảng cloud cho phép vận hành code Python 24/7.
- **Nhiệm vụ:**
    - Nhận các request từ Frontend.
    - Truyền dữ liệu đầu vào đến `rules.py` để phân tích.
    - Sinh kết quả dự đoán (ví dụ: "Low", "Medium", "High").
    - Trả kết quả về cho Frontend dưới dạng JSON.
- **Đặc điểm:** là ứng dụng **động** (dynamic), thực hiện toàn bộ phần xử lý logic.

### 3.2.3. Luồng hoạt động dữ liệu (Data Flow)

1. Người dùng nhập dữ liệu và nhấn nút “Dự đoán” tại Frontend.
2. `script.js` thu thập dữ liệu form và gửi request API đến Backend 
3. Backend (`app.py`) nhận request, chuyển dữ liệu cho `rules.py`.
4. `rules.py` áp dụng bộ luật từ `rules.json`, tính toán và trả kết quả dự đoán.
5. `app.py` đóng gói kết quả thành JSON và gửi lại cho Frontend.
6. Frontend nhận phản hồi, hiển thị kết quả cho người dùng.

## **3.3. Thuật toán: Hệ chuyên gia (Expert System)**

📝 Thuật toán mà nhóm áp dụng để chẩn đoán nguy cơ đột quỵ dựa trên nguyên lý của **hệ chuyên gia** – một nhánh cổ điển trong Trí tuệ Nhân tạo (AI). 

📊 Khác với **học máy (Machine Learning)**, vốn để máy tự học từ dữ liệu lớn, hệ chuyên gia hoạt động dựa trên **cơ sở tri thức** (Knowledge Base) gồm các luật IF–THEN (NẾU–THÌ) do con người định nghĩa sẵn, và một **bộ máy suy diễn** (Inference Engine) có nhiệm vụ áp dụng những luật này lên dữ liệu đầu vào.

### 3.3.1. Cơ sở tri thức (Knowledge Base)

- Toàn bộ “kiến thức” của hệ thống được lưu trong tệp `rules.json`.
- Mỗi luật (Rule) có ba thành phần:
    - `id`: mã số định danh.
    - `condition`: điều kiện logic (ví dụ: `age > 60 and hypertension == 1`).
    - `risk_level`: kết quả nếu điều kiện đúng (High, Medium, Low).
- Trong dự án này, có tổng cộng **144 luật** được định nghĩa. Chúng đóng vai trò như “kinh nghiệm” của một bác sĩ, nhưng được máy tính đọc hiểu và áp dụng.

### 3.3.2. Dữ liệu đầu vào (Input Data)

Người dùng cung cấp một số thông tin sức khỏe cơ bản: tuổi, giới tính, cân nặng, chiều cao, tình trạng cao huyết áp, bệnh tim, tiểu đường, hút thuốc, thói quen tập luyện.

- Nếu thiếu dữ liệu, hệ thống tự điền **giá trị mặc định** (ví dụ: tuổi = 30, BMI = 22).
- Hệ thống cũng tính toán thêm chỉ số BMI bằng công thức:

$$
BMI = \frac{\text{Cân nặng (kg)}}{\text{(Chiều cao (m))}^2}
$$

Đây là chỉ số quan trọng để đánh giá tình trạng thừa cân, một yếu tố làm tăng nguy cơ đột quỵ.

### 3.3.3. Bộ máy suy diễn (Inference Engine)

🧠 Bộ máy suy diễn là “bộ não trung tâm” của hệ chuyên gia. Nó không hề chứa kiến thức riêng, mà chỉ đóng vai trò dùng dữ liệu đầu vào (facts), đem so khớp với kho tri thức (các luật IF–THEN), rồi từ đó tìm ra kết quả phù hợp nhất. Bản chất của nó là một quá trình **tìm luật đúng để áp dụng**.

🔄 Trong hệ thống này, cách suy luận được chọn là **suy diễn tiến (Forward Chaining)**. Nghĩa là ta đi từ dữ liệu ban đầu → kiểm tra dần từng điều kiện trong luật → cho tới khi rút ra được kết luận (ví dụ mức nguy cơ bệnh). Cách này khác với **suy diễn lùi (Backward Chaining)**, nơi ta giả sử trước một kết quả rồi lần ngược lại để kiểm chứng.

⚡ Khi duyệt luật, hệ thống dùng chiến lược **First-Match**: hễ gặp một luật khớp thì ngay lập tức kích hoạt (fire 🔥) và dừng lại, không kiểm tra tiếp các luật khác. Nhờ đó tốc độ nhanh hơn, nhưng đồng thời thứ tự sắp xếp luật trong kho tri thức cũng trở nên quan trọng, vì luật nào đặt trước sẽ có cơ hội “ăn” kết quả trước.

Trong code (file `rules.py`), tiến trình diễn ra như sau:

- Hệ thống nhận dữ liệu từ người dùng qua hàm `evaluate_risk()` (ví dụ tuổi, cân nặng, chiều cao, bệnh nền, thói quen...).
- Dữ liệu được chuẩn hóa: tính thêm các giá trị phát sinh (chẳng hạn BMI từ cân nặng và chiều cao) và điền mặc định cho chỗ thiếu (ví dụ tuổi mặc định = 30).
- Sau đó, máy lần lượt kiểm tra 144 luật trong `rules.json`. Mỗi điều kiện IF được tính bằng hàm `eval()` để xem có đúng với dữ liệu hay không.
- Nếu đúng, luật đó được kích hoạt và trả về kết quả gắn sẵn (ví dụ “High risk”). Nếu duyệt hết mà không có luật nào khớp, hệ thống mặc định trả về “Low risk”.

👉 Điều quan trọng cần nhớ: bộ máy suy diễn **không thông minh, không sáng tạo, không tự học**. Nó chỉ là cơ chế so khớp dữ liệu với luật đã có. Vì dùng suy diễn tiến và chiến lược First-Match, kết quả cuối cùng phụ thuộc mạnh vào **độ chính xác của dữ liệu đầu vào** và **cách thiết kế, sắp xếp luật** trong cơ sở tri thức.

### 3.3.4. Kết quả và khuyến nghị (Output & Advice)

Sau khi xác định được mức nguy cơ (Low, Medium, High), hệ thống gọi hàm `get_advice()` để sinh ra lời khuyên cụ thể:

- **Low (Thấp):** tiếp tục duy trì lối sống lành mạnh, ăn uống cân bằng, vận động thường xuyên.
- **Medium (Trung bình):** tăng cường kiểm tra sức khỏe, giảm cân nếu BMI cao, tham khảo ý kiến bác sĩ.
- **High (Cao):** cần đi khám ngay, kiểm soát bệnh nền (tiểu đường, tim mạch, huyết áp), thay đổi lối sống khẩn cấp (ngừng hút thuốc, điều chỉnh chế độ vận động).

# 4. Hướng dẫn cài đặt

💻 Để chạy dự án này trên máy tính cá nhân (local), bạn cần thiết lập cả **Backend (API – bộ não)** và **Frontend (Web – giao diện )**.

## 4.1. Lấy mã nguồn (Clone Repo)

Mở **Terminal / Git Bash** và chạy lệnh sau:

```bash
git clone [Dán link repo GitHub của bạn vào đây]
cd StrokePredict
```

## 4.2. Cài đặt Backend (API – Bộ não)

Phần này sẽ chạy **server API** (`app.py`) trên máy.

1. **Tạo môi trường ảo (Khuyến nghị):**

```bash
python -m venv venv
```

1. **Kích hoạt môi trường ảo:**
- Windows:
    
    ```bash
    .\venv\Scripts\activate
    ```
    
- macOS/Linux:
    
    ```bash
    source venv/bin/activate
    ```
    
1. **Cài đặt thư viện:**

```bash
pip install -r requirements.txt
```

1. **Chạy server:**

```bash
python app.py
```

👉 Nếu thành công, server sẽ chạy tại: [**http://127.0.0.1:5000**](http://127.0.0.1:5000/)

## 4.3. Chạy Frontend (Web – Giao diện)

1. Mở thư mục dự án (vd: `StrokePredict`) bằng **VS Code**.
2. Vào thư mục `docs/`, tìm file `index.html`.
3. Chuột phải → **Open with Live Server**.
4. Trình duyệt sẽ mở tại: [**http://127.0.0.1:5500**](http://127.0.0.1:5500/) (hoặc cổng khác).

## 4.4. Kết nối Frontend ↔ Backend Local

Hiện tại bạn có:

- **Backend** chạy ở `...:5000`
- **Frontend** chạy ở `...:5500`

👉 Mặc định code Frontend đang gọi API trên **Render**. Bạn cần sửa thành **local**.

1. Mở file: `docs/static/script.js`.
2. Tìm dòng `fetch(...)` (đang trỏ về Render).

Thay từ:

```jsx
fetch('https://ten-du-an.onrender.com/predict', {
    // ...
});
```

Bằng:

```jsx
fetch('http://127.0.0.1:5000/predict', {
    // ...
});
```

1. Lưu file lại.

👉 Giờ thì mở [**http://127.0.0.1:5500**](http://127.0.0.1:5500/) → Web sẽ gọi API tại [**http://127.0.0.1:5000**](http://127.0.0.1:5000/)

# 5. Phân công thành viên

🤝 Dự án này là kết quả của sự hợp tác và nỗ lực của nhóm. Để đảm bảo tiến độ và chất lượng sản phẩm, nhóm đã phân công vai trò rõ ràng ngay từ đầu, bám sát theo quy trình làm việc đã đề ra.

Các vai trò chính bao gồm **Team Lead** (Quản lý chung và Tài liệu), **Knowledge Engineer** (Xây dựng logic AI), và **Fullstack Developer** (Phát triển và triển khai web). 

👥 Bảng dưới đây mô tả chi tiết thông tin và đóng góp cụ thể của từng thành viên :

| **Tên thành viên** | **Lớp** | **Mã số sinh viên** | **Công việc chính được phân công** |
| --- | --- | --- | --- |
| **Lê Thị Khánh Linh** | K69A-AI2 | 24022384 | Lên kế hoạch, phân công công việc, giám sát tiến độ. Test chức năng và hoàn thiện tài liệu (README.md, Báo cáo). |
| **Nguyễn Huyền Thương** | K69A-AI2 | 24022462 | **Logic AI (Knowledge Engineer):** Xây dựng bộ luật chuyên gia (`rules.json`, `rules.py`) và định nghĩa I/O cho API. |
| **Nguyễn Quang Sang** | K69A-AI4 | 24022440 | **Coder Web (Fullstack):** Xây dựng API (Backend), thiết kế giao diện (Frontend) và deploy sản phẩm. |

💡 Ngoài ra, trong quá trình phát triển web, mọi người trong nhóm đều tích cực đóng góp ý tưởng để sửa đổi, cải tiến và hoàn thiện sản phẩm.

# 6. Tài liệu tham khảo

- [https://pubmed.ncbi.nlm.nih.gov/14718319/](https://pubmed.ncbi.nlm.nih.gov/14718319/)
- [https://www.ahajournals.org/doi/10.1161/01.str.28.7.1507](https://www.ahajournals.org/doi/10.1161/01.str.28.7.1507)
- [https://www.cdc.gov/stroke/risk-factors/index.html](https://www.cdc.gov/stroke/risk-factors/index.html)
- [https://www.stroke.org.uk/stroke/types/risk-factors](https://www.stroke.org.uk/stroke/types/risk-factors)