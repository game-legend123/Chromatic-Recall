# Chromatic Recall (Trí Nhớ Sắc Màu)

Đây là một dự án game được xây dựng bằng Next.js và được hỗ trợ bởi AI của Google trong Firebase Studio.

## Giới thiệu

**Chromatic Recall** là một trò chơi giải đố thử thách trí nhớ không gian và màu sắc của bạn. Trong một mê cung 3D, một con đường với chuỗi màu sắc sẽ được hiển thị trong giây lát. Nhiệm vụ của bạn là ghi nhớ và tái tạo lại chính xác con đường đó để đi từ điểm bắt đầu (S) đến điểm kết thúc (E).

Mỗi cấp độ được tạo ra bởi AI, mang đến những thử thách độc đáo và ngày càng khó hơn về độ phức tạp của mê cung, độ dài của con đường và sự tương đồng của các màu sắc.

## Luật chơi

1.  **Bắt đầu:** Nhấn nút "Bắt đầu Game" để vào cấp độ đầu tiên.
2.  **Ghi nhớ:** Khi một cấp độ bắt đầu, bạn sẽ có 3 giây để quan sát và ghi nhớ con đường màu sắc được chiếu sáng trong mê cung.
3.  **Di chuyển:** Sau 3 giây, các màu sắc sẽ bị làm mờ. Bạn phải điều khiển nhân vật của mình đi theo đúng chuỗi màu đã được hiển thị trước đó.
    *   Sử dụng các phím mũi tên (`↑`, `↓`, `←`, `→`) hoặc phím `W`, `A`, `S`, `D` để di chuyển.
    *   Bạn cũng có thể nhấp chuột vào các ô liền kề để di chuyển.
4.  **Sai lầm:** Nếu bạn bước vào một ô không đúng trong chuỗi, bạn sẽ được đưa trở lại vị trí xuất phát và phải bắt đầu lại con đường.
5.  **Chiến thắng:** Khi bạn đi đến ô kết thúc (E) một cách chính xác, bạn sẽ hoàn thành cấp độ, nhận điểm và có thể tiếp tục với cấp độ tiếp theo khó hơn.
6.  **Mục tiêu:** Cố gắng vượt qua nhiều cấp độ nhất có thể và đạt được điểm số cao nhất!

## Cài đặt và Chạy dự án

Để chạy dự án này trên máy tính của bạn, hãy làm theo các bước sau:

**Yêu cầu:**

*   [Node.js](https://nodejs.org/) (phiên bản 18 trở lên)
*   [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)

**Các bước cài đặt:**

1.  **Sao chép (Clone) mã nguồn:**
    ```bash
    git clone <URL_repository_cua_ban>
    cd <ten_thu_muc_du_an>
    ```

2.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```
    Hoặc nếu bạn dùng yarn:
    ```bash
    yarn install
    ```

3.  **Cấu hình biến môi trường:**
    Tạo một file tên là `.env.local` ở thư mục gốc của dự án và thêm khóa API Google AI của bạn vào đó:
    ```
    GOOGLE_API_KEY=KHOA_API_CUA_BAN
    ```

4.  **Chạy máy chủ phát triển (Development Server):**
    Dự án này sử dụng Genkit để quản lý các flow AI. Bạn cần chạy hai lệnh trong hai cửa sổ terminal riêng biệt.

    *   **Terminal 1: Chạy Genkit**
        ```bash
        npm run genkit:watch
        ```

    *   **Terminal 2: Chạy ứng dụng Next.js**
        ```bash
        npm run dev
        ```

5.  **Mở trình duyệt:**
    Mở trình duyệt và truy cập vào [http://localhost:9002](http://localhost:9002) để bắt đầu chơi.

Chúc bạn có những giờ phút chơi game vui vẻ!
