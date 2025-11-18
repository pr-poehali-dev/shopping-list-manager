import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Contractor, ContractorStats } from '@/types/product';

interface ContractorDetailProps {
  contractor: Contractor;
  stats: ContractorStats;
  onBack: () => void;
  onResetDebt: () => void;
}

const ContractorDetail = ({ contractor, stats, onBack, onResetDebt }: ContractorDetailProps) => {
  const groupPurchasesByDate = () => {
    const grouped: Record<string, typeof stats.purchases> = {};
    
    stats.purchases.forEach(purchase => {
      const date = new Date(purchase.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(purchase);
    });
    
    return grouped;
  };

  const grouped = groupPurchasesByDate();
  const dates = Object.keys(grouped).sort((a, b) => {
    const dateA = new Date(grouped[a][0].createdAt);
    const dateB = new Date(grouped[b][0].createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        <h2 className="text-2xl font-bold">{contractor.name}</h2>
      </div>

      <Card className="p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Количество товаров</p>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Сумма долга</p>
            <p className="text-2xl font-bold text-accent">{stats.totalDebt.toFixed(2)} ₽</p>
          </div>
          <div className="flex items-end">
            {stats.totalDebt > 0 && (
              <Button onClick={onResetDebt} className="bg-green-600 text-white hover:bg-green-700 w-full">
                <Icon name="CheckCircle" size={20} className="mr-2" />
                Обнулить долг
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {dates.map(date => {
          const datePurchases = grouped[date];
          const dateTotal = datePurchases.reduce((sum, p) => sum + p.totalPrice, 0);
          
          return (
            <div key={date} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={18} className="text-muted-foreground" />
                  <h3 className="text-lg font-semibold">{date}</h3>
                  <span className="text-sm text-muted-foreground">({datePurchases.length})</span>
                </div>
                <p className="text-sm font-medium">Сумма: {dateTotal.toFixed(2)} ₽</p>
              </div>
              
              <div className="space-y-2">
                {datePurchases.map(purchase => (
                  <Card key={purchase.id} className="p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                      <div className="md:col-span-2">
                        <p className="font-medium">{purchase.productName}</p>
                        <p className="text-sm text-muted-foreground">Артикул: {purchase.article}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Количество</p>
                        <p className="font-medium">{purchase.quantity}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Цена за шт.</p>
                        <p className="font-medium">{purchase.buyPrice.toFixed(2)} ₽</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Итого</p>
                        <p className="font-medium text-accent">{purchase.totalPrice.toFixed(2)} ₽</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {stats.purchases.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="Package" size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">Нет товаров</p>
          <p className="text-sm mt-2">Товары появятся после добавления с указанием этого контрагента</p>
        </div>
      )}
    </div>
  );
};

export default ContractorDetail;
