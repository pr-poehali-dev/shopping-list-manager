import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [shoppingList, setShoppingList] = useState<Product[]>([]);
  const [database, setDatabase] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const savedShoppingList = localStorage.getItem('carfix_shopping_list');
    const savedDatabase = localStorage.getItem('carfix_database');
    
    if (savedShoppingList) {
      setShoppingList(JSON.parse(savedShoppingList));
    }
    if (savedDatabase) {
      setDatabase(JSON.parse(savedDatabase));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carfix_shopping_list', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('carfix_database', JSON.stringify(database));
  }, [database]);

  const addNewProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      article: '',
      photo: null,
      hint: '',
      quantity: 1,
      sellPrice: 0,
      buyPrice: 0,
      createdAt: new Date().toISOString(),
    };
    setShoppingList([...shoppingList, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setShoppingList(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const deleteFromDatabase = (id: string) => {
    setDatabase(prev => prev.filter(item => item.id !== id));
    toast({
      title: 'Товар удален',
      description: 'Товар успешно удален из базы',
    });
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const sendToDatabase = () => {
    const selectedProducts = shoppingList.filter(p => selectedIds.has(p.id));
    
    if (selectedProducts.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Выберите хотя бы один товар',
        variant: 'destructive',
      });
      return;
    }

    const incomplete = selectedProducts.filter(
      p => !p.name || !p.article || p.buyPrice === 0
    );

    if (incomplete.length > 0) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля выбранных товаров',
        variant: 'destructive',
      });
      return;
    }

    setDatabase(prev => [...prev, ...selectedProducts]);
    setShoppingList(prev => prev.filter(p => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    
    toast({
      title: 'Успешно!',
      description: `Отправлено ${selectedProducts.length} товаров в базу`,
    });
  };

  const filterProducts = (products: Product[]) => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.article.toLowerCase().includes(query)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://cdn.poehali.dev/files/758635db-2414-48dc-bacb-3d76d9b2b7b5.png" 
              alt="CARFIX Logo" 
              className="h-12 object-contain"
            />
          </div>
          <div className="relative max-w-2xl mx-auto">
            <Icon 
              name="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              size={20} 
            />
            <Input
              placeholder="Поиск по артикулу или названию товара..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="shopping" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="shopping" className="text-base">
              Список покупок
            </TabsTrigger>
            <TabsTrigger value="database" className="text-base">
              Общая база
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shopping" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Товаров: {shoppingList.length}
              </h2>
              <Button
                onClick={addNewProduct}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить товар
              </Button>
            </div>

            {selectedIds.size > 0 && (
              <div className="bg-accent/10 border border-accent rounded-lg p-4 flex items-center justify-between">
                <span className="font-medium">
                  Выбрано товаров: {selectedIds.size}
                </span>
                <Button
                  onClick={sendToDatabase}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить в базу
                </Button>
              </div>
            )}

            <div className="space-y-3">
              {filterProducts(shoppingList).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onUpdate={(updates) => updateProduct(product.id, updates)}
                  onDelete={() => deleteProduct(product.id)}
                  isSelected={selectedIds.has(product.id)}
                  onToggleSelect={() => toggleSelection(product.id)}
                  showCheckbox={true}
                />
              ))}
            </div>

            {shoppingList.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg">Список покупок пуст</p>
                <p className="text-sm mt-2">Нажмите "Добавить товар" чтобы начать</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Всего в базе: {database.length}
              </h2>
            </div>

            <div className="space-y-3">
              {filterProducts(database).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onUpdate={() => {}}
                  onDelete={() => deleteFromDatabase(product.id)}
                  isSelected={false}
                  onToggleSelect={() => {}}
                  showCheckbox={false}
                  readOnly={true}
                />
              ))}
            </div>

            {database.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Icon name="Database" size={64} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg">База данных пуста</p>
                <p className="text-sm mt-2">Товары появятся здесь после отправки из списка покупок</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
