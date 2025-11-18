import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Contractor, ContractorStats } from '@/types/product';

interface ContractorCardProps {
  contractor: Contractor;
  stats: ContractorStats;
  onDelete: () => void;
  onClick: () => void;
  onResetDebt: () => void;
}

const ContractorCard = ({ contractor, stats, onDelete, onClick, onResetDebt }: ContractorCardProps) => {
  return (
    <Card className="p-4 bg-white border-border hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1" onClick={onClick}>
          <div className="flex items-center gap-3 mb-2">
            <Icon name="User" size={24} className="text-primary" />
            <h3 className="text-lg font-semibold">{contractor.name}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Товаров:</span>
              <span className="ml-2 font-medium">{stats.totalProducts}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Сумма долга:</span>
              <span className="ml-2 font-medium text-accent">{stats.totalDebt.toFixed(2)} ₽</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {stats.totalDebt > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onResetDebt();
              }}
              className="text-green-600 hover:text-green-700"
            >
              <Icon name="CheckCircle" size={18} className="mr-1" />
              Обнулить
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Icon name="Trash2" size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContractorCard;
