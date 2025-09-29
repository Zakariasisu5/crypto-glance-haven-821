import { useState } from 'react';
import { useItems, useAddItem, useUpdateItem, useDeleteItem } from '@/integrations/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { toast } from "sonner";

const Items = () => {
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');

  const { data: items, isLoading, isError } = useItems();
  const addItemMutation = useAddItem();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();

  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    
    try {
      await addItemMutation.mutateAsync({ name: newItem.trim() });
      setNewItem('');
      toast.success('Item added successfully');
    } catch (error) {
      toast.error(`Error adding item: ${error.message}`);
    }
  };

  const handleEditStart = (item) => {
    setEditingItem(item.id);
    setEditValue(item.name);
  };

  const handleEditSave = async (id) => {
    if (!editValue.trim()) return;
    
    try {
      await updateItemMutation.mutateAsync({ id, name: editValue.trim() });
      setEditingItem(null);
      setEditValue('');
      toast.success('Item updated successfully');
    } catch (error) {
      toast.error(`Error updating item: ${error.message}`);
    }
  };

  const handleEditCancel = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItemMutation.mutateAsync(id);
        toast.success('Item deleted successfully');
      } catch (error) {
        toast.error(`Error deleting item: ${error.message}`);
      }
    }
  };

  const handleKeyPress = (e, action, ...args) => {
    if (e.key === 'Enter') {
      action(...args);
    }
  };

  if (isLoading) return <div className="text-center mt-8 terminal-glow">Loading items...</div>;
  if (isError) return <div className="text-center mt-8 terminal-glow text-destructive">Error: Unable to fetch items</div>;

  return (
    <div className="bg-background text-foreground p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 terminal-glow">Items Manager</h1>
        <p className="text-muted-foreground">Manage your items with full CRUD operations</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddItem)}
              placeholder="Enter item name..."
              className="flex-1 terminal-input"
            />
            <Button 
              onClick={handleAddItem} 
              disabled={!newItem.trim() || addItemMutation.isPending}
              className="px-6"
            >
              {addItemMutation.isPending ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Items ({items?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!items || items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items yet. Add your first item above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-muted/50 p-4 rounded-lg border">
                  <div className="flex-1 mr-4">
                    {editingItem === item.id ? (
                      <Input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleEditSave, item.id)}
                        className="terminal-input"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {editingItem === item.id ? (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleEditSave(item.id)}
                          disabled={!editValue.trim() || updateItemMutation.isPending}
                          className="px-3"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleEditCancel}
                          className="px-3"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditStart(item)}
                          className="px-3"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deleteItemMutation.isPending}
                          className="px-3"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Items;
