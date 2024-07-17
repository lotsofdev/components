@php
    function propertiesPreview($props, $level = 0)
    {

        $str = [];

        array_push($str, '<ul class="_component">');

        foreach ($props as $prop => $value) {
            if ($prop === 'html' || $prop === 'compiledFile') {
            } else if (substr($prop, 0, 1) === '_') {
            } else if (is_array($value) && !\Sugar\is\assocArray($value)) {
                array_push($str, '<ul class="_array">');
                array_push($str, propertiesPreview($value, $level + 1));
                array_push($str, '</ul>');
            } else if (isset($value->_metas->class)) {
                $metas = $value->_metas;
                $class = $metas->class;
                array_push($str, '<li class="_prop">');
                array_push($str, "<div class=\"_label\">$prop</div><div class=\"_class\">$class</div>");
                array_push($str, propertiesPreview((array) $value, $level + 1));
                array_push($str, '</li>');
            } else if (is_string($value)) {
                array_push($str, "<li class=\"_prop -string\">
                                                <div class=\"_label\">$prop</div><div class=\"_value\">$value</div>
                                            </li>");
            } else if (is_numeric($value)) {
                array_push($str, "<li class=\"_prop -numeric\">
                                                <div class=\"_label\">$prop</div><div class=\"_value\">$value</div>
                                            </li>");
            } else if (is_bool($value)) {
                $displayValue = $value ? 'true' : 'false';
                array_push($str, "<li class=\"_prop -boolean\">
                                                <div class=\"_label\">$prop</div><div class=\"_value\">$displayValue</div>
                                            </li>");
            } else if (is_null($value)) {
                array_push($str, "<li class=\"_prop -null\">
                                                <div class=\"_label\">$prop</div><div class=\"_value\">null</div>
                                            </li>");
            }
        }

        array_push($str, '</ul>');

        return implode('', $str);
    }
@endphp

<div class="properties-preview">
    {!! propertiesPreview(get_defined_vars()) !!}
</div>