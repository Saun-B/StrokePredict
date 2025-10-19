import json

# Load rules và sources từ JSON
# try:
#     with open('rules.json', 'r') as f:
#         data = json.load(f)
#         rules = data['rules']
#         sources = data.get('sources', {})
#     print(f"Loaded {len(rules)} rules and {len(sources)} sources successfully from rules.json")
# except FileNotFoundError:
#     print("Lỗi: Không tìm thấy rules.json. Tạo file trước!")
#     exit(1)
# except json.JSONDecodeError as e:
#     print(f"Lỗi JSON: {e}. Kiểm tra syntax rules.json!")
#     exit(1)
import os

base_dir = os.path.dirname(__file__)
json_path = os.path.join(base_dir, "rules.json")

try:
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        rules = data['rules']
        sources = data.get('sources', {})
    print(f"Loaded {len(rules)} rules and {len(sources)} sources successfully from rules.json")
except FileNotFoundError:
    print("Lỗi: Không tìm thấy rules.json. Tạo file trước!")
    exit(1)
except json.JSONDecodeError as e:
    print(f"Lỗi JSON: {e}. Kiểm tra syntax rules.json!")
    exit(1)

def calculate_bmi(weight, height):
    """Tính BMI = weight (kg) / (height (m) * height (m))"""
    if height <= 0:
        return 22  # Default BMI nếu chiều cao không hợp lệ
    bmi = weight / (height * height)
    print(f"BMI calculated: {bmi:.1f} (weight={weight}kg, height={height}m)")
    return bmi

def evaluate_risk(input_data):
    # Default cho input thiếu
    input_data = input_data.copy()
    input_data.setdefault('age', 30)
    input_data.setdefault('hypertension', 0)
    input_data.setdefault('heart_disease', 0)
    input_data.setdefault('diabetes', 0)  
    input_data.setdefault('smoking_status', 'never smoked')
    input_data.setdefault('exercise', 1)
    input_data.setdefault('gender', 'Female')

    # Tính BMI nếu có weight và height
    if 'weight' in input_data and 'height' in input_data:
        input_data['bmi'] = calculate_bmi(input_data['weight'], input_data['height'])
    else:
        input_data.setdefault('bmi', 22)  # Default BMI nếu không tính

    for rule in rules:
        try:
            if eval(rule['condition'], {"__builtins__": {}}, input_data):
                source_list = [f"{key} - {value}" for key, value in sources.items()]
                source_text = "\n\t".join(source_list)
                print(f"\nKết quả: Rule {rule['id']} activated: {rule['condition']}")
                print(f"Nguy cơ: {rule['risk_level']}")
                print(f"Nguồn:\t{source_text}")
                return rule['risk_level'].capitalize()
        except Exception as e:
            print(f"Error in evaluating rule {rule['id']}: {e}")
            continue
    print("\nKết quả: Default rule activated (Low risk)")
    return "Low"

def get_advice(risk):
    """Trả về lời khuyên dựa trên mức nguy cơ"""
    if risk == "Low":
        return """
🌿 Khuyến nghị sức khỏe cho bạn:
- Duy trì lối sống lành mạnh: ăn uống cân đối, tập luyện đều đặn, và khám sức khỏe định kỳ.
- Giữ cân nặng và chỉ số BMI trong giới hạn lý tưởng (<25) bằng chế độ ăn ít đường, ít chất béo và vận động đều.
- Tránh thuốc lá, hạn chế căng thẳng và duy trì thói quen ngủ nghỉ hợp lý để bảo vệ sức khỏe lâu dài."""
    elif risk == "Medium":
        return """
⚠️ Khuyến nghị sức khỏe cho bạn:
- Tham khảo ý kiến bác sĩ để kiểm tra chi tiết hơn, đặc biệt nếu bạn có tiền sử gia đình hoặc các yếu tố như huyết áp cao.
- Tăng cường tập thể dục ít nhất 150 phút mỗi tuần (ví dụ: đi bộ nhanh, bơi lội) và cân nhắc giảm cân nếu BMI trong khoảng 25 đến 30.
- Hạn chế muối, đường, chất béo bão hòa; ưu tiên rau xanh, trái cây, thực phẩm giàu chất xơ và uống đủ nước."""
    elif risk == "High":
        return """
🚨 Khuyến nghị sức khỏe cho bạn:
- Liên hệ ngay với bác sĩ để thăm khám và đánh giá nguy cơ chuyên sâu, đặc biệt nếu bạn có bệnh lý nền như tiểu đường, tim mạch, hoặc huyết áp cao.
- Giảm ngay các yếu tố rủi ro: ngừng hút thuốc, kiểm soát cân nặng (nhắm BMI <25), và tập luyện nhẹ nhàng dưới hướng dẫn chuyên môn.
- Theo dõi sức khỏe định kỳ (huyết áp, đường huyết) và tuân thủ phác đồ điều trị nếu được chỉ định; duy trì chế độ ăn uống và sinh hoạt hợp lý."""
    return ""

if __name__ == "__main__":
    print("=== Hệ chuyên gia chẩn đoán nguy cơ đột quỵ ===\n")
    print("Nhập thông tin của bạn (ấn Enter để dùng giá trị mặc định):\n")

    # Nhập thủ công các tiêu chí
    age = input("Tuổi (số): ") or 30
    gender = input("Giới tính (Male/Female): ") or "Female"
    hypertension = input("Bạn có bị cao huyết áp không? (0: Không, 1: Có): ") or 0
    heart_disease = input("Bạn có bị bệnh tim mạch không? (0: Không, 1: Có): ") or 0
    diabetes = input("Bạn có bị tiểu đường không? (0: Không, 1: Có): ") or 0 
    smoking_status = input("Tình trạng hút thuốc (smokes/formerly smoked/never smoked): ") or "never smoked"
    exercise = input("Bạn có thường xuyên tập thể dục không? (0: Không, 1: Có): ") or 1
    weight = input("Nhập cân nặng (kg): ") or 60
    height = input("Nhập chiều cao (m): ") or 1.7

    # Chuyển đổi thành số hoặc string hợp lệ
    try:
        age = int(age)
        hypertension = int(hypertension)
        heart_disease = int(heart_disease)
        diabetes = int(diabetes)  
        exercise = int(exercise)
        weight = float(weight)
        height = float(height)
    except ValueError:
        print("Lỗi: Nhập số không hợp lệ, dùng giá trị mặc định!")
        age, hypertension, heart_disease, diabetes, exercise, weight, height = 30, 0, 0, 0, 1, 60, 1.7

    # Tạo input_data từ input
    input_data = {
        "age": age,
        "gender": gender,
        "hypertension": hypertension,
        "heart_disease": heart_disease,
        "diabetes": diabetes, 
        "smoking_status": smoking_status,
        "exercise": exercise,
        "weight": weight,
        "height": height
    }

    # Đánh giá nguy cơ
    risk = evaluate_risk(input_data)
    print(f"\nTóm tắt: Tuổi={age}, Giới tính={gender}, Nguy cơ={risk}")
    advice = get_advice(risk)
    print(advice)