# 4 Quy tắc BIND

1. direct exchange: Hiểu đơn giản gửi msg vào queue có routing key khớp chính xác.
   ex: những msg nào cùng exchange và routing key thì mới nhận được dạng 1:1

2. Fanout exchange: Gửi msg tới tất cả queue đã được bay bào exchange bỏ qua routing key
   ex: gửi thông báo cho toàn user

3. Topic exchange
4. Header

# Advanced Messaging Features / Messaging Patterns & Reliability Features

1. Work queue patten:

- ý nghĩa là chia tải nhiều worker làm việc, worker nào xong thì tới worker khác.
- Tránh worker bị crash: dùng prefetch để sử lý.

2. TTL (Time to live): Mọi msg gửi vào điều có thời gian sau khoảng thời gian đã khai báo thì nó sẽ hết hạn.

3. DLX (dead letter exchange):

- Là một cơ chế khi thực hiện 1 việc nào đó mà bị lỗi thì nó sẽ là người lưu lại thông tin và sẽ được thực hiện lại.
- sẽ có 1 worker đễ lưu chúng lại

4. Delayed Message.
   note: không dùng fanout
5. priority queue
6. Durability & Persistence

# Thuật ngữ:

- durable: queue bên vững sẽ bị mấy khi có lỗi sảy ra.
