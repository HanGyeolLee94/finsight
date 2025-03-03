package com.finsight.lab.util;

import java.util.List;

public class RSIUtil {
	
	public static double calculateRSI(List<Double> closePrices, int period) {
		if (closePrices.size() < period + 1) {
			throw new IllegalArgumentException("Need at least " + (period + 1) + " prices to calculate RSI.");
		}

		double gainSum = 0, lossSum = 0;

		// Calculate initial average gains/losses
		for (int i = 1; i <= period; i++) {
			double change = closePrices.get(i - 1) - closePrices.get(i);
			if (change > 0) {
				gainSum += change;
			} else {
				lossSum += Math.abs(change);
			}
		}

		double avgGain = gainSum / period;
		double avgLoss = lossSum / period;

		// Calculate RSI
		for (int i = period; i < closePrices.size() - 1; i++) {
			double change = closePrices.get(i) - closePrices.get(i + 1);

			if (change > 0) {
				avgGain = ((avgGain * (period - 1)) + change) / period;
				avgLoss = ((avgLoss * (period - 1))) / period;
			} else {
				avgGain = (avgGain * (period - 1)) / period;
				avgLoss = ((avgLoss * (period - 1)) + Math.abs(change)) / period;
			}
		}

		double rs = avgLoss == 0 ? 100 : avgGain / avgLoss;
		return 100 - (100 / (1 + rs));
	}
}

/*
D1: 51.00  
D2: 50.50  
D3: 50.00  
D4: 49.50  
D5: 50.00  
D6: 51.50  
D7: 52.00  
D8: 51.00  
D9: 50.00  
D10: 49.50  
D11: 50.50  
D12: 51.00  
D13: 51.50  
D14: 52.50  
D15: 51.00  <-- 가장 오래된 데이터

### **RSI 계산 예제 (최근 데이터 기준)**  

**가격 데이터 (최근 데이터가 앞에 옴, 즉 `ORDER BY DATE DESC`)**  
```
D1: 51.00  
D2: 50.50  
D3: 50.00  
D4: 49.50  
D5: 50.00  
D6: 51.50  
D7: 52.00  
D8: 51.00  
D9: 50.00  
D10: 49.50  
D11: 50.50  
D12: 51.00  
D13: 51.50  
D14: 52.50  
D15: 51.00  <-- 가장 오래된 데이터
```
- **D1이 가장 최근이고, D15가 가장 오래된 데이터**  
- **즉, 리스트에서 `closePrices.get(0)`이 가장 최신 데이터이고, `closePrices.get(closePrices.size() - 1)`이 가장 오래된 데이터**  

---

### **1. 초기 상승폭 / 하락폭 계산 (처음 14일)**
- D1: `51.00 → 50.50` (하락) → -0.50  
- D2: `50.50 → 50.00` (하락) → -0.50  
- D3: `50.00 → 49.50` (하락) → -0.50  
- D4: `49.50 → 50.00` (상승) → +0.50  
- D5: `50.00 → 51.50` (상승) → +1.50  
- D6: `51.50 → 52.00` (상승) → +0.50  
- D7: `52.00 → 51.00` (하락) → -1.00  
- D8: `51.00 → 50.00` (하락) → -1.00  
- D9: `50.00 → 49.50` (하락) → -0.50  
- D10: `49.50 → 50.50` (상승) → +1.00  
- D11: `50.50 → 51.00` (상승) → +0.50  
- D12: `51.00 → 51.50` (상승) → +0.50  
- D13: `51.50 → 52.50` (상승) → +1.00  
- D14: `52.50 → 51.00` (하락) → -1.50  

**총 상승폭 합계 (GainSum)** = 0.50 + 1.50 + 0.50 + 1.00 + 0.50 + 0.50 + 1.00 = `5.50`  
**총 하락폭 합계 (LossSum)** = 0.50 + 0.50 + 0.50 + 1.00 + 1.00 + 0.50 + 1.50 = `5.50`  

**평균 상승폭 (AvgGain)**
```
AvgGain = 5.50 / 14 = 0.3929
```
**평균 하락폭 (AvgLoss)**
```
AvgLoss = 5.50 / 14 = 0.3929
```

---

### **2. 첫 번째 RSI 값 계산**
```
RS = AvgGain / AvgLoss = 0.3929 / 0.3929 = 1.000
RSI = 100 - (100 / (1 + RS)) = 100 - (100 / (1 + 1.000))
RSI = 100 - (100 / 2) = 50.00
```

---

### **3. 두 번째 이후 RSI 값 갱신 (D15 → D1까지 반복)**
#### **D15 → D1으로 이동하면서 매일 RSI 갱신**
(새로운 `gain`, `loss`를 기존 `AvgGain`, `AvgLoss`에 반영)
- 만약 `오늘 가격 - 어제 가격 > 0`이면 `AvgGain` 업데이트
- 만약 `오늘 가격 - 어제 가격 < 0`이면 `AvgLoss` 업데이트  

예를 들어 D14 → D13에서 `52.50 → 51.00` (하락 `-1.50`)이면:
```
AvgGain = (AvgGain * 13) / 14
AvgLoss = ((AvgLoss * 13) + 1.50) / 14
```
이렇게 새로운 값으로 갱신됨.  
이 과정을 D15 → D1까지 반복해서 RSI를 매일 구하게 됨.

---

### **최종 요약**
- **RSI 계산을 위해 `15개`의 가격이 필요함.**  
- **가장 최신 데이터(`D1`)부터 가장 오래된 데이터(`D15`)까지 15개를 가져와서 RSI 계산.**  
- **첫 번째 RSI는 14일간 평균 상승/하락폭을 구한 후 계산.**  
- **그 이후에는 새로운 가격 변동을 반영하여 `AvgGain`, `AvgLoss`를 계속 갱신.**  

이제 **최근 데이터 기준으로 RSI가 계산되는 방식**이 확실해졌을 거야! 🚀
 * */
