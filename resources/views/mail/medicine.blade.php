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
            <div class="title">Thông tin đơn thuốc bác sĩ đã kê cho bạn!</div>
            <div class="info-item">
                <div class="info-row">
                    <span>Bác sĩ:</span>
                    <span class="info-value">{{ $data->doctors->users->name }}</span>
                </div>
                <div class="info-row">
                    @if ($data->medicines && count($data->medicines) > 0)
                        <div class="container">
                            <div class="info-item">
                                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                    <thead>
                                        <tr style="background-color: #bae6fd; text-align: center;">
                                            <th style="padding: 8px; border: 1px solid #ddd;">Tên thuốc</th>
                                            <th style="padding: 8px; border: 1px solid #ddd;">Liều lượng</th>
                                            <th style="padding: 8px; border: 1px solid #ddd;">Số lượng</th>
                                            <th style="padding: 8px; border: 1px solid #ddd;">Hướng dẫn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($data->medicines as $medicine)
                                            <tr style="text-align: center;">
                                                <td style="padding: 8px; border: 1px solid #ddd;">{{ $medicine->name }}
                                                </td>
                                                <td style="padding: 8px; border: 1px solid #ddd;">
                                                    {{ $medicine->pivot->dosage }}</td>
                                                <td style="padding: 8px; border: 1px solid #ddd;">
                                                    {{ $medicine->pivot->qty }}</td>
                                                <td style="padding: 8px; border: 1px solid #ddd;">
                                                    {{ $medicine->pivot->usage }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</body>

</html>
