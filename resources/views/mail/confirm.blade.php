<!DOCTYPE html>
<html lang="en">

<head>
    <title>Mail xác nhận đơn đặt lịch khám bệnh</title>
    <style>
        .container {
            margin-top: 10px;
            margin-bottom: 20px;
            padding: 10px;
            border: 4px solid #bae6fd;
            /* sky-200 */
            border-radius: 0.5rem;
            /* rounded-lg */
            border-style: dotted;
            background-color: #ebf8ff;
            /* sky-50 */
        }

        .title {
            text-transform: uppercase;
            text-align: center;
            font-weight: 600;
            /* font-semibold */
        }

        .info-item {
            margin-top: 10px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .info-value {
            font-weight: 600;
            margin-left: 5px;
            /* font-semibold */
        }

        .price {
            color: #f00;
            /* red color */
        }

        @media (max-width: 640px) {

            /* Optional: To handle responsiveness if needed */
            .container {
                padding: 5px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div>
            <div class="title">Thông tin xác nhận lịch khám từ bác sĩ </div>
            <div class="info-item">
                <div class="info-row">
                    <span>Bác sĩ:</span>
                    <span class="info-value">{{ $data->doctors->users->name }}</span>
                </div>
                <div class="info-row">
                    <span>Ngày khám:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($data->schedules->date)->format('d/m/Y') }}</span>
                </div>
                <div class="info-row">
                    <span>Thời gian khám:</span>
                    <span class="info-value">
                        {{ \Carbon\Carbon::parse(preg_replace('/\s\(.+\)$/', '', $data->schedules->time_slots->start_time))->format('h:i A') }}
                        -
                        {{ \Carbon\Carbon::parse(preg_replace('/\s\(.+\)$/', '', $data->schedules->time_slots->end_time))->format('h:i A') }}
                    </span>
                </div>
                <div class="info-row">
                    <span>Giá khám:</span>
                    <span class="info-value price">{{ convert_price($data->total_price, true) }} đ</span>
                </div>
                <div class="info-row">
                    <span>Trạng thái xác nhận:</span>
                    @if ($data->status == 'confirm')
                        <span class="info-value price">Bác sĩ đã chấp nhận lịch khám từ bạn! Xin vui lòng sắp xếp thời
                            gian đến khám bệnh đúng hẹn. Chúc bạn mạnh khỏe! Xin chân thành cảm ơn!</span>
                    @elseif($data->status == 'stop')
                        <span class="info-value price">Rất tiếc phải xin lỗi bạn! Vì bác sĩ đã từ chối lịch khám từ bạn
                            do một số lý do cá nhân từ bác sĩ! Xin bạn thông cảm và lựa chọn vào một thời gian khác.
                            Chúc bạn mạnh khỏe!
                            Xin chân thành cảm ơn!</span>
                    @endif
                </div>
            </div>
        </div>
    </div>
</body>

</html>
