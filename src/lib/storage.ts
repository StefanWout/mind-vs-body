import { DailyEntry } from '@/types/tracking';
import { supabase } from '@/integrations/supabase/client';

export const storage = {
  getEntries: async (): Promise<DailyEntry[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      return (data || []).map(entry => ({
        id: entry.id,
        date: entry.date,
        periodStatus: entry.period_status as any,
        nausea: entry.nausea,
        nauseaTime: entry.nausea_time,
        moodMorning: entry.mood_morning,
        moodMidday: entry.mood_midday,
        moodEvening: entry.mood_evening,
        poopQuantity: entry.poop_quantity,
        poopConsistency: entry.poop_consistency as any,
        sleepQuality: entry.sleep_quality,
        gotUpToPee: entry.got_up_to_pee,
        peeTime: entry.pee_time,
        hadHeadache: entry.had_headache,
        headacheTime: entry.headache_time,
        tookMedication: entry.took_medication,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at
      }));
    } catch (error) {
      console.error('Error reading from database:', error);
      return [];
    }
  },

  saveEntry: async (entry: DailyEntry): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbEntry = {
        user_id: user.id,
        date: entry.date,
        period_status: entry.periodStatus,
        nausea: entry.nausea,
        nausea_time: entry.nauseaTime,
        mood_morning: entry.moodMorning,
        mood_midday: entry.moodMidday,
        mood_evening: entry.moodEvening,
        poop_quantity: entry.poopQuantity,
        poop_consistency: entry.poopConsistency,
        sleep_quality: entry.sleepQuality,
        got_up_to_pee: entry.gotUpToPee,
        pee_time: entry.peeTime,
        had_headache: entry.hadHeadache,
        headache_time: entry.headacheTime,
        took_medication: entry.tookMedication
      };

      const { error } = await supabase
        .from('daily_entries')
        .upsert(dbEntry, { onConflict: 'user_id,date' });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  },

  getEntryByDate: async (date: string): Promise<DailyEntry | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        date: data.date,
        periodStatus: data.period_status as any,
        nausea: data.nausea,
        nauseaTime: data.nausea_time,
        moodMorning: data.mood_morning,
        moodMidday: data.mood_midday,
        moodEvening: data.mood_evening,
        poopQuantity: data.poop_quantity,
        poopConsistency: data.poop_consistency as any,
        sleepQuality: data.sleep_quality,
        gotUpToPee: data.got_up_to_pee,
        peeTime: data.pee_time,
        hadHeadache: data.had_headache,
        headacheTime: data.headache_time,
        tookMedication: data.took_medication,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error getting entry:', error);
      return null;
    }
  },

  deleteEntry: async (date: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('daily_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('date', date);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting from database:', error);
      throw error;
    }
  }
};
