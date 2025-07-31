import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";
import { useCustomers } from "@/hooks/useCustomers";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Zap,
  Crown,
  Target,
  Award,
  Sparkles,
  Rocket,
  Shield,
  Brain,
  Heart,
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  Calendar,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

interface SuperGaboModuleProps {
  onBack: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  progress: number;
  maxProgress: number;
  category: 'sales' | 'customer' | 'product' | 'efficiency';
  reward: string;
}

interface SuperGaboStats {
  overallScore: number;
  level: number;
  nextLevelProgress: number;
  totalAchievements: number;
  completedAchievements: number;
  weeklyGoals: number;
  monthlyGoals: number;
}

const SuperGaboModule = ({ onBack }: SuperGaboModuleProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { products } = useProducts();
  const { sales } = useSales();
  const { customers } = useCustomers();

  // Calculate super gabo stats
  const calculateStats = (): SuperGaboStats => {
    const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
    const totalProducts = products.length;
    const totalCustomers = customers.length;
    
    // Calculate overall score based on business metrics
    const salesScore = Math.min(100, (totalSales / 100000) * 100);
    const productScore = Math.min(100, (totalProducts / 50) * 100);
    const customerScore = Math.min(100, (totalCustomers / 100) * 100);
    
    const overallScore = Math.round((salesScore + productScore + customerScore) / 3);
    const level = Math.floor(overallScore / 20) + 1;
    const nextLevelProgress = (overallScore % 20) * 5;

    return {
      overallScore,
      level,
      nextLevelProgress,
      totalAchievements: 12,
      completedAchievements: Math.floor(overallScore / 10),
      weeklyGoals: 75,
      monthlyGoals: 60
    };
  };

  // Generate achievements based on actual data
  const generateAchievements = (): Achievement[] => {
    const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
    const completedSales = sales.filter(sale => sale.status === 'completed').length;
    
    return [
      {
        id: "1",
        title: "Vendedor Estrella",
        description: "Alcanza $100,000 en ventas totales",
        icon: <Star className="h-6 w-6" />,
        completed: totalSales >= 100000,
        progress: Math.min(totalSales, 100000),
        maxProgress: 100000,
        category: 'sales',
        reward: "+500 puntos XP"
      },
      {
        id: "2",
        title: "Rey del POS",
        description: "Completa 50 ventas exitosas",
        icon: <Crown className="h-6 w-6" />,
        completed: completedSales >= 50,
        progress: completedSales,
        maxProgress: 50,
        category: 'sales',
        reward: "Insignia Dorada"
      },
      {
        id: "3",
        title: "Catálogo Maestro",
        description: "Registra 100 productos diferentes",
        icon: <Package className="h-6 w-6" />,
        completed: products.length >= 100,
        progress: products.length,
        maxProgress: 100,
        category: 'product',
        reward: "+300 puntos XP"
      },
      {
        id: "4",
        title: "Constructor de Relaciones",
        description: "Registra 50 clientes únicos",
        icon: <Users className="h-6 w-6" />,
        completed: customers.length >= 50,
        progress: customers.length,
        maxProgress: 50,
        category: 'customer',
        reward: "Título VIP"
      },
      {
        id: "5",
        title: "Eficiencia Total",
        description: "Mantén un promedio de 95% de ventas completadas",
        icon: <Zap className="h-6 w-6" />,
        completed: (completedSales / Math.max(sales.length, 1)) >= 0.95,
        progress: Math.round((completedSales / Math.max(sales.length, 1)) * 100),
        maxProgress: 95,
        category: 'efficiency',
        reward: "Boost de Velocidad"
      },
      {
        id: "6",
        title: "Gurú del Inventario",
        description: "Mantén el stock optimizado sin faltantes",
        icon: <Target className="h-6 w-6" />,
        completed: products.filter(p => p.stock > p.min_stock).length >= products.length * 0.9,
        progress: products.filter(p => p.stock > p.min_stock).length,
        maxProgress: products.length,
        category: 'product',
        reward: "Insignia de Precisión"
      }
    ];
  };

  const stats = calculateStats();
  const achievements = generateAchievements();

  // Get level info
  const getLevelInfo = (level: number) => {
    const levelNames = [
      "Novato", "Aprendiz", "Competente", "Experto", "Maestro", "Leyenda"
    ];
    const levelColors = [
      "text-gray-600", "text-blue-600", "text-green-600", 
      "text-purple-600", "text-gold-600", "text-red-600"
    ];
    
    return {
      name: levelNames[Math.min(level - 1, levelNames.length - 1)],
      color: levelColors[Math.min(level - 1, levelColors.length - 1)]
    };
  };

  const levelInfo = getLevelInfo(stats.level);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Super Gabo
            </h1>
            <p className="text-muted-foreground">Sistema de gamificación y logros empresariales</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Crown className="h-4 w-4 mr-2" />
            Nivel {stats.level} - {levelInfo.name}
          </Badge>
          <div className="text-right">
            <p className="text-2xl font-bold">{stats.overallScore}/100</p>
            <p className="text-sm text-muted-foreground">Puntuación General</p>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-full">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Progreso al Siguiente Nivel</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.nextLevelProgress}% completado para nivel {stats.level + 1}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{stats.nextLevelProgress}%</p>
            </div>
          </div>
          <Progress value={stats.nextLevelProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logros Completados</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAchievements}/{stats.totalAchievements}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.completedAchievements / stats.totalAchievements) * 100)}% completado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Semanales</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyGoals}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +5% vs semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Mensuales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyGoals}%</div>
            <p className="text-xs text-muted-foreground">
              En camino al objetivo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 días</div>
            <p className="text-xs text-muted-foreground">
              ¡Sigue así!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
          <TabsTrigger value="challenges">Desafíos</TabsTrigger>
          <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Rendimiento General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Ventas</span>
                  <div className="flex items-center gap-2">
                    <Progress value={75} className="w-20 h-2" />
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Clientes</span>
                  <div className="flex items-center gap-2">
                    <Progress value={60} className="w-20 h-2" />
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Productos</span>
                  <div className="flex items-center gap-2">
                    <Progress value={45} className="w-20 h-2" />
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Eficiencia</span>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="w-20 h-2" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Logros Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.filter(a => a.completed).slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <div className="text-primary">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">{achievement.reward}</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.completed ? "bg-primary/5 border-primary/20" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${achievement.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                    {achievement.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between items-center">
                      <Badge variant={achievement.completed ? "default" : "secondary"}>
                        {achievement.category}
                      </Badge>
                      <span className="text-sm font-medium text-primary">
                        {achievement.reward}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Desafío Semanal
                </CardTitle>
                <CardDescription>Alcanza 20 ventas esta semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Progreso</span>
                    <span>15/20 ventas</span>
                  </div>
                  <Progress value={75} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Recompensa: +1000 puntos XP + Insignia Especial
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Desafío Mensual
                </CardTitle>
                <CardDescription>Registra 25 nuevos clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Progreso</span>
                    <span>12/25 clientes</span>
                  </div>
                  <Progress value={48} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Recompensa: Título "Cazador de Clientes" + 2500 XP
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Tabla de Líderes
              </CardTitle>
              <CardDescription>Rankings globales del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Tú", score: stats.overallScore, level: stats.level, badge: "👑" },
                  { rank: 2, name: "María González", score: 85, level: 4, badge: "🥈" },
                  { rank: 3, name: "Carlos Ruiz", score: 78, level: 4, badge: "🥉" },
                  { rank: 4, name: "Ana López", score: 72, level: 3, badge: "" },
                  { rank: 5, name: "Pedro Martín", score: 68, level: 3, badge: "" }
                ].map((player) => (
                  <div key={player.rank} className={`flex items-center justify-between p-4 rounded-lg ${player.rank === 1 ? 'bg-primary/10 border-primary/20 border' : 'bg-muted/50'}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{player.badge || `#${player.rank}`}</span>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">Nivel {player.level}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{player.score}</p>
                      <p className="text-sm text-muted-foreground">puntos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperGaboModule;