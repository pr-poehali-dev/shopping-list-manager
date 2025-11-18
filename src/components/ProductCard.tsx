import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Product, Contractor } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
  onDelete: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
  showCheckbox: boolean;
  readOnly?: boolean;
  contractors?: Contractor[];
}

const ProductCard = ({
  product,
  onUpdate,
  onDelete,
  isSelected,
  onToggleSelect,
  showCheckbox,
  readOnly = false,
  contractors = [],
}: ProductCardProps) => {
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [showContractorDialog, setShowContractorDialog] = useState(false);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const [tempHint, setTempHint] = useState('');
  const [selectedContractorId, setSelectedContractorId] = useState<string>(product.contractorId || '');
  const [editMode, setEditMode] = useState({
    name: false,
    article: false,
    quantity: false,
    sellPrice: false,
    buyPrice: false,
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhoto = () => {
    onUpdate({ photo: tempPhoto });
    setShowPhotoDialog(false);
    setTempPhoto(null);
  };

  const cancelPhoto = () => {
    setShowPhotoDialog(false);
    setTempPhoto(null);
  };

  const confirmHint = () => {
    onUpdate({ hint: tempHint });
    setShowHintDialog(false);
  };

  const openHintDialog = () => {
    setTempHint(product.hint);
    setShowHintDialog(true);
  };

  const openContractorDialog = () => {
    setSelectedContractorId(product.contractorId || '');
    setShowContractorDialog(true);
  };

  const confirmContractor = () => {
    onUpdate({ contractorId: selectedContractorId || undefined });
    setShowContractorDialog(false);
  };

  const handleFieldSave = (field: keyof typeof editMode, value: string | number) => {
    onUpdate({ [field]: value });
    setEditMode(prev => ({ ...prev, [field]: false }));
  };

  return (
    <Card className="p-4 bg-white border-border hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <Icon name="Clock" size={14} />
          <span>{formatDateTime(product.createdAt)}</span>
        </div>
        
        <div className="flex gap-3 items-start">
          {showCheckbox && (
            <div className="pt-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onToggleSelect}
                className="w-5 h-5"
              />
            </div>
          )}

        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-1 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => !readOnly && setShowPhotoDialog(true)}
              className="w-12 h-12 p-0"
              disabled={readOnly}
            >
              {product.photo ? (
                <img src={product.photo} alt="Product" className="w-full h-full object-cover rounded" />
              ) : (
                <Icon name="Image" size={20} />
              )}
            </Button>
          </div>

          <div className="md:col-span-1 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={openHintDialog}
              className="w-12 h-12 p-0"
              disabled={readOnly}
            >
              <Icon name="Lightbulb" size={20} />
            </Button>
          </div>

          {!readOnly && contractors.length > 0 && (
            <div className="md:col-span-1 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={openContractorDialog}
                className="w-12 h-12 p-0"
                title="Выбрать контрагента"
              >
                <Icon name="User" size={20} />
              </Button>
            </div>
          )}

          <div className="md:col-span-3">
            {editMode.name && !readOnly ? (
              <div className="flex gap-1">
                <Input
                  value={product.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  placeholder="Название"
                  className="h-9"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditMode(prev => ({ ...prev, name: false }))}
                  className="h-9 w-9 p-0"
                >
                  <Icon name="Check" size={16} />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => !readOnly && setEditMode(prev => ({ ...prev, name: true }))}
                className={`px-3 py-2 border rounded min-h-[36px] flex items-center ${
                  !readOnly ? 'cursor-pointer hover:bg-secondary' : ''
                }`}
              >
                {product.name || <span className="text-muted-foreground text-sm">Название</span>}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {editMode.article && !readOnly ? (
              <div className="flex gap-1">
                <Input
                  value={product.article}
                  onChange={(e) => onUpdate({ article: e.target.value })}
                  placeholder="Артикул"
                  className="h-9"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditMode(prev => ({ ...prev, article: false }))}
                  className="h-9 w-9 p-0"
                >
                  <Icon name="Check" size={16} />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => !readOnly && setEditMode(prev => ({ ...prev, article: true }))}
                className={`px-3 py-2 border rounded min-h-[36px] flex items-center ${
                  !readOnly ? 'cursor-pointer hover:bg-secondary' : ''
                }`}
              >
                {product.article || <span className="text-muted-foreground text-sm">Артикул</span>}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {editMode.sellPrice && !readOnly ? (
              <div className="flex gap-1">
                <Input
                  type="number"
                  value={product.sellPrice}
                  onChange={(e) => onUpdate({ sellPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="h-9"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditMode(prev => ({ ...prev, sellPrice: false }))}
                  className="h-9 w-9 p-0"
                >
                  <Icon name="Check" size={16} />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => !readOnly && setEditMode(prev => ({ ...prev, sellPrice: true }))}
                className={`px-3 py-2 border rounded min-h-[36px] flex items-center ${
                  !readOnly ? 'cursor-pointer hover:bg-secondary' : ''
                }`}
              >
                {product.sellPrice > 0 ? (
                  `${product.sellPrice} ₽`
                ) : (
                  <span className="text-muted-foreground text-sm">Цена продажи</span>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {editMode.buyPrice && !readOnly ? (
              <div className="flex gap-1">
                <Input
                  type="number"
                  value={product.buyPrice}
                  onChange={(e) => onUpdate({ buyPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="h-9"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditMode(prev => ({ ...prev, buyPrice: false }))}
                  className="h-9 w-9 p-0"
                >
                  <Icon name="Check" size={16} />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => !readOnly && setEditMode(prev => ({ ...prev, buyPrice: true }))}
                className={`px-3 py-2 border rounded min-h-[36px] flex items-center ${
                  !readOnly ? 'cursor-pointer hover:bg-secondary' : ''
                }`}
              >
                {product.buyPrice > 0 ? (
                  `${product.buyPrice} ₽`
                ) : (
                  <span className="text-muted-foreground text-sm">Цена покупки</span>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            {editMode.quantity && !readOnly ? (
              <div className="flex gap-1">
                <Input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => onUpdate({ quantity: parseInt(e.target.value) || 1 })}
                  placeholder="1"
                  className="h-9"
                  autoFocus
                  min="1"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditMode(prev => ({ ...prev, quantity: false }))}
                  className="h-9 w-9 p-0"
                >
                  <Icon name="Check" size={16} />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => !readOnly && setEditMode(prev => ({ ...prev, quantity: true }))}
                className={`px-3 py-2 border rounded min-h-[36px] flex items-center justify-center ${
                  !readOnly ? 'cursor-pointer hover:bg-secondary' : ''
                }`}
              >
                {product.quantity}
              </div>
            )}
          </div>
        </div>

        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 p-0"
          >
            <Icon name="X" size={20} />
          </Button>
        )}

        {readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 p-0"
          >
            <Icon name="Trash2" size={18} />
          </Button>
        )}
      </div>
      </div>

      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Загрузить фото товара</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            {tempPhoto && (
              <img src={tempPhoto} alt="Preview" className="w-full h-48 object-contain border rounded" />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelPhoto}>
              Отклонить
            </Button>
            <Button onClick={confirmPhoto} disabled={!tempPhoto}>
              Принять
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showHintDialog} onOpenChange={setShowHintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подсказка</DialogTitle>
          </DialogHeader>
          <Textarea
            value={tempHint}
            onChange={(e) => setTempHint(e.target.value)}
            placeholder="Где найти этот товар..."
            rows={4}
            disabled={readOnly}
          />
          {!readOnly && (
            <DialogFooter>
              <Button onClick={confirmHint}>
                Сохранить
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showContractorDialog} onOpenChange={setShowContractorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Выбрать контрагента</DialogTitle>
          </DialogHeader>
          <Select value={selectedContractorId} onValueChange={setSelectedContractorId}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите контрагента" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Без контрагента</SelectItem>
              {contractors.map(contractor => (
                <SelectItem key={contractor.id} value={contractor.id}>
                  {contractor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={confirmContractor}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductCard;