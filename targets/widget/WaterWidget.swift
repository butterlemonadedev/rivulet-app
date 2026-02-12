import WidgetKit
import SwiftUI

struct WaterData: Decodable {
    let currentGlasses: Int
    let goal: Int
}

struct WaterEntry: TimelineEntry {
    let date: Date
    let glasses: Int
    let goal: Int

    var percentage: Double {
        guard goal > 0 else { return 0 }
        return min(Double(glasses) / Double(goal), 1.0)
    }
}

struct WaterProvider: TimelineProvider {
    let groupId = "group.com.butterlemonade.rivulet.shared"

    func placeholder(in context: Context) -> WaterEntry {
        WaterEntry(date: Date(), glasses: 4, goal: 8)
    }

    func getSnapshot(in context: Context, completion: @escaping (WaterEntry) -> Void) {
        completion(readEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<WaterEntry>) -> Void) {
        let entry = readEntry()
        let next = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        completion(Timeline(entries: [entry], policy: .after(next)))
    }

    private func readEntry() -> WaterEntry {
        let defaults = UserDefaults(suiteName: groupId)
        guard let json = defaults?.string(forKey: "waterData"),
              let data = json.data(using: .utf8),
              let water = try? JSONDecoder().decode(WaterData.self, from: data)
        else {
            return WaterEntry(date: Date(), glasses: 0, goal: 8)
        }
        return WaterEntry(date: Date(), glasses: water.currentGlasses, goal: water.goal)
    }
}

struct WaterWidgetView: View {
    var entry: WaterEntry

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.01, green: 0.24, blue: 0.54),
                    Color(red: 0.01, green: 0.11, blue: 0.17)
                ],
                startPoint: .top,
                endPoint: .bottom
            )

            VStack(spacing: 6) {
                Text("\(entry.glasses)")
                    .font(.system(size: 44, weight: .bold, design: .rounded))
                    .foregroundColor(Color(red: 0.28, green: 0.79, blue: 0.89))

                Text("of \(entry.goal) glasses")
                    .font(.system(size: 13, weight: .light))
                    .foregroundColor(.gray)

                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 3)
                            .fill(.black.opacity(0.3))
                            .frame(height: 6)
                        RoundedRectangle(cornerRadius: 3)
                            .fill(Color(red: 0.28, green: 0.79, blue: 0.89))
                            .frame(width: geo.size.width * entry.percentage, height: 6)
                    }
                }
                .frame(height: 6)
            }
            .padding(16)
        }
    }
}

@main
struct RivuletWidget: Widget {
    let kind = "RivuletWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WaterProvider()) { entry in
            WaterWidgetView(entry: entry)
        }
        .configurationDisplayName("Rivulet")
        .description("Track your daily water intake")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
