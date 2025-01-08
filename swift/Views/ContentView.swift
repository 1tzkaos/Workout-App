// Views/ContentView.swift
struct ContentView: View {
    @StateObject private var store = ExerciseStore()
    
    var body: some View {
        TabView {
            NavigationView {
                HomeView()
            }
            .tabItem {
                Label("Sets", systemImage: "dumbbell.fill")
            }
            
            Text("Sessions")
                .tabItem {
                    Label("Sessions", systemImage: "timer")
                }
            
            Text("Weight")
                .tabItem {
                    Label("Weight", systemImage: "scalemass.fill")
                }
        }
        .environmentObject(store)
    }
}