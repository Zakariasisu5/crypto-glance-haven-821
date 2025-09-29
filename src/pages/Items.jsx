import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

const Items = () => {
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  const { data: items, isLoading, isError } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('items').select('*');
      if (error) throw error;
      return data;
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (name) => {
      const { data, error } = await supabase.from('items').insert([{ name }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('items');
      setNewItem('');
      toast.success('Item added successfully');
    },
    onError: (error) => {
      toast.error(`Error adding item: ${error.message}`);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, name }) => {
      const { data, error } = await supabase.from('items').update({ name }).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('items');
      setEditingItem(null);
      toast.success('Item updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating item: ${error.message}`);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase.from('items').delete().eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('items');
      toast.success('Item deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting item: ${error.message}`);
    },
  });

  if (isLoading) return <div className="text-center mt-8 terminal-glow">Loading items...</div>;
  if (isError) return <div className="text-center mt-8 terminal-glow text-destructive">Error: Unable to fetch items</div>;

  return (
    <div className="bg-background text-foreground p-4">
      <h1 className="text-2xl font-bold mb-4 terminal-glow">Items</h1>
      
      <div className="mb-4 flex">
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter new item name"
          className="mr-2 terminal-input"
        />
        <Button onClick={() => addItemMutation.mutate(newItem)} disabled={!newItem.trim()}>
          Add Item
        </Button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between bg-card p-2 rounded">
            {editingItem === item.id ? (
              <Input
                type="text"
                value={item.name}
                onChange={(e) => {
                  const updatedItems = items.map((i) =>
                    i.id === item.id ? { ...i, name: e.target.value } : i
                  );
                  queryClient.setQueryData(['items'], updatedItems);
                }}
                className="mr-2 terminal-input"
              />
            ) : (
              <span>{item.name}</span>
            )}
            <div>
              {editingItem === item.id ? (
                <Button onClick={() => updateItemMutation.mutate({ id: item.id, name: item.name })} className="mr-2">
                  Save
                </Button>
              ) : (
                <Button onClick={() => setEditingItem(item.id)} className="mr-2">
                  Edit
                </Button>
              )}
              <Button onClick={() => deleteItemMutation.mutate(item.id)} variant="destructive">
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;
