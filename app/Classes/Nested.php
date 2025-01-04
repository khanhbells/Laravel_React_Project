<?php

namespace App\Classes;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class Nested
{
    protected $params;
    protected $checked;
    protected $data;
    protected $count;
    protected $count_level;
    protected $lft;
    protected $rgt;
    protected $level;

    public function __construct($params = NULL)
    {
        $this->params = $params;
        $this->checked = NULL;
        $this->data = NULL;
        $this->count = 0;
        $this->count_level = 0;
        $this->lft = NULL;
        $this->rgt = NULL;
        $this->level = NULL;
    }


    public function Get()
    {
        $result = DB::table($this->params['table'])
            ->select('id', 'name', 'parent_id', 'lft', 'rgt', 'level', 'order')
            ->whereNull('deleted_at')
            ->orderBy('lft', 'asc')->get()->toArray();

        $this->data = $result;
    }

    public function Set()
    {
        if (isset($this->data) && is_array($this->data) && count($this->data)) {

            $arr = null;
            foreach ($this->data as $key => $val) {
                $arr[$val->id][$val->parent_id] = 1;
                $arr[$val->parent_id][$val->id] = 1;
            }
            return $arr;
        }
    }

    //Duyet theo chieu sau DFS
    public function Recursive($start = 0, $arr = NULL)
    {
        $this->lft[$start] = ++$this->count;
        $this->level[$start] = $this->count_level;
        if (isset($arr) && is_array($arr) && count($arr)) {
            foreach ($arr as $key => $val) {
                if ((isset($arr[$start][$key]) || isset($arr[$key][$start])) && (!isset($this->checked[$key][$start]) && !isset($this->checked[$start][$key]))) {
                    $this->count_level++;
                    $this->checked[$start][$key] = 1;
                    $this->checked[$key][$start] = 1;
                    $this->Recursive($key, $arr);
                    $this->count_level--;
                }
            }
        }
        $this->rgt[$start] = ++$this->count;
    }

    public function Action($auth = null)
    {
        if (isset($this->level) && is_array($this->level) && isset($this->lft) && is_array($this->lft) && isset($this->rgt) && is_array($this->rgt)) {
            $data = null;
            foreach ($this->level as $key => $val) {
                if ($key == 0) continue;
                $data[] = [
                    'id' => $key,
                    'level' => $val,
                    'lft' => $this->lft[$key],
                    'rgt' => $this->rgt[$key],
                    'user_id' => $auth->id
                ];
            }
        }
        if (isset($data) && is_array($data) && count($data)) {
            DB::table($this->params['table'])->upsert($data, 'id', ['level', 'lft', 'rgt']);
        }
    }
}
