<!DOCTYPE html>
<html lang="en">

<head>
    <title>Mail đơn đặt lịch khám bệnh</title>
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
            <div class="title">Thông tin bệnh nhân khám bệnh</div>
        </div>
        <div class="info-item">
            <div class="info-row">
                <span>Họ tên:</span>
                <span class="info-value">{{ $data->full_name }}</span>
            </div>
            <div class="info-row">
                <span>Email:</span>
                <span class="info-value">{{ $data->email }}</span>
            </div>
            <div class="info-row">
                <span>SĐT:</span>
                <span class="info-value">{{ $data->phone }}</span>
            </div>
            <div class="info-row">
                <span>Ngày sinh:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($data->birthday)->format('d/m/Y') }}</span>
            </div>
            <div class="info-row">
                <span>Giới tính:</span>
                <span class="info-value">{{ $data->gender == 1 ? 'Nam' : 'Nữ' }}</span>
            </div>
            <div class="info-row">
                <span>Thành phố:</span>
                <span class="info-value">{{ $data->provinces->name_province }}</span>
            </div>
            <div class="info-row">
                <span>Quận huyện:</span>
                <span class="info-value">{{ $data->districts->name_district }}</span>
            </div>
            <div class="info-row">
                <span>Phường xã:</span>
                <span class="info-value">{{ $data->wards->name_ward }}</span>
            </div>
            <div class="info-row">
                <span>Địa chỉ hiện tại:</span>
                <span class="info-value">{{ $data->address }}</span>
            </div>
            <div class="info-row">
                <span>Lý do khám bệnh:</span>
                <span class="info-value">{{ $data->note }}</span>
            </div>
            <div class="info-row">
                <span>Hình thức thanh toán:</span>
                <span class="info-value">
                    @if ($data->method == 'cod')
                        Thanh toán trực tiếp
                    @elseif($data->method == 'momo')
                        Thanh toán qua Momo
                    @elseif($data->method == 'paypal')
                        Thanh toán qua Paypal
                    @elseif($data->method == 'vnpay')
                        Thanh toán qua VNPAY
                    @else
                        ''
                    @endif
                </span>
            </div>
        </div>
    </div>
    <div class="container">
        <div>
            <div class="title">Thông tin bác sĩ và lịch khám</div>
            <div class="info-item">
                <div class="info-row">
                    <span>Bác sĩ:</span>
                    <span class="info-value">{{ $data->doctors->users->name }}</span>
                </div>
                <div class="info-row">
                    <span>Ngày khám:</span>
                    <span
                        class="info-value">{{ \Carbon\Carbon::parse($data->schedules->date)->format('d/m/Y') }}</span>
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
            </div>
        </div>
    </div>
</body>

</html>
